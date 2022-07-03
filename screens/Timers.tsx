import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  ScrollView,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { ActivityIndicator, FAB, List } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { useMutation, useQueryClient } from "react-query";
import {
  IContact,
  IMessage,
  pingServer,
  useGetUser,
} from "../api/api";

dayjs.extend(relativeTime);
dayjs.extend(duration);

export interface ITimerMessage extends IMessage {
  recipient: string;
  smsEnabled: boolean;
  emailEnabled: boolean;
}

function formatDuration(period: string) {
  let parts = [];
  const duration = dayjs.duration(period);

  // return nothing when the duration is falsy or not correctly parsed (P0D)
  if (!duration || duration.toISOString() === "P0D") return;

  if (duration.years() >= 1) {
    const years = Math.floor(duration.years());
    parts.push(years + " " + (years > 1 ? "years" : "year"));
  }

  if (duration.months() >= 1) {
    const months = Math.floor(duration.months());
    parts.push(months + " " + (months > 1 ? "months" : "month"));
  }

  if (duration.days() >= 1) {
    const days = Math.floor(duration.days());
    parts.push(days + " " + (days > 1 ? "days" : "day"));
  }

  if (duration.hours() >= 1) {
    const hours = Math.floor(duration.hours());
    parts.push(hours + " " + (hours > 1 ? "hours" : "hour"));
  }

  if (duration.minutes() >= 1) {
    const minutes = Math.floor(duration.minutes());
    parts.push(minutes + " " + (minutes > 1 ? "minutes" : "minute"));
  }

  if (duration.seconds() >= 1) {
    const seconds = Math.floor(duration.seconds());
    parts.push(seconds + " " + (seconds > 1 ? "seconds" : "second"));
  }

  return parts.join(", ");
}

export interface IDurationMessage {
  messages: any;
  content: string;
  recipient: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
  duration: number;
}

const AccordionList = ({
  targetDate,
  messages,
  duration,
}: {
  targetDate: dayjs.Dayjs;
  messages: any;
  duration: number;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <List.Accordion
      description={<CountdownTimer targetDate={targetDate} />}
      title={
        <Text style={{ fontWeight: "bold" }}>
          {formatDuration(dayjs.duration(duration).toISOString())}
        </Text>
      }
      left={(props) => <List.Icon {...props} icon="clock" />}
      expanded={expanded}
      onPress={handlePress}
    >
      {messages.map((m: ITimerMessage, i: number) => {
        return (
          <List.Item
            right={(props) => (
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                }}
              >
                <MaterialIcons
                  size={24}
                  name="email"
                  style={m.emailEnabled ? {} : { opacity: 0 }}
                />
                <MaterialIcons
                  size={24}
                  name="message"
                  style={m.smsEnabled ? {} : { opacity: 0 }}
                />
              </View>
            )}
            left={(props) => (
              <View style={{ opacity: 0 }}>
                <List.Icon {...props} icon="subdirectory-arrow-right" />
              </View>
            )}
            key={i}
            title={m.recipient}
            description={m.content}
            descriptionNumberOfLines={3}
          />
        );
      })}
    </List.Accordion>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: dayjs.Dayjs }) => {
  const [target, setTarget] = React.useState(targetDate.diff(dayjs()));

  const timer = useEffect(() => {
    const interval = setInterval(() => {
      setTarget(targetDate.diff(dayjs()));
    }, 500);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <Text>
      {target >= 0
        ? `in ${formatDuration(dayjs.duration(target).toISOString())}`
        : `${formatDuration(dayjs.duration(target).toISOString())} ago`}
    </Text>
  );
};

export interface IDuration {
  days: number;
  weeks: number;
  months: number;
  years: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

export const mapDurationMessages = (contacts: IContact[]) => {
  const durations: Set<number> = new Set();
  for (const contact of contacts) {
    contact.messages.forEach((m) => durations.add(dayjs.duration(m.duration).asMilliseconds()));
  }
  const mappedDurationMessages = Array.from(durations).map((d) => {
    const dateMessages: any[] = [];
    for (const contact of contacts) {
      for (const message of contact.messages) {
        if (dayjs.duration(message.duration).asMilliseconds() === d) {
          dateMessages.push({
            content: message.content,
            recipient: contact.name,
            emailEnabled: contact.emailEnabled,
            smsEnabled: contact.smsEnabled,
          });
        }
      }
    }

    return {
      duration: d,
      messages: dateMessages,
    };
  });
  const sortedMessages = mappedDurationMessages.sort((a, b) => {
    return (
      dayjs.duration(a.duration).asMilliseconds() -
      dayjs.duration(b.duration).asMilliseconds()
    );
  });
  return sortedMessages;
};

const TimersList = () => {
  const { status, data, error, isSuccess } = useGetUser();

  const [lastPing, setLastPing] = useState<Date>(new Date());
  const [durationMessages, setDurationMessages] = useState<any[]>([]);

  const getContacts = useEffect(() => {
    if (status === "success") {
      const contacts: IContact[] = data.contacts;
      setLastPing(data.lastPing);
      const mappedMessages = mapDurationMessages(contacts);
      setDurationMessages(mappedMessages);
    }
  }, [status, data, lastPing]);

  return lastPing ? (
    <List.Section>
      {durationMessages.map((dm, i) => (
        <AccordionList
          key={i}
          messages={dm.messages}
          targetDate={dayjs(lastPing).add(dayjs.duration(dm.duration))}
          duration={dm.duration}
        />
      ))}
    </List.Section>
  ) : (
    <ActivityIndicator animating={true} />
  );
};

export function Timers() {
  const queryClient = useQueryClient();
  const pingMutation = useMutation(pingServer, {
    onSuccess: (newTimestamp: Date) => {
      console.log(newTimestamp);
      queryClient.invalidateQueries("user");
    },
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TimersList />
      </ScrollView>
      <FAB
        icon={() => (
          <MaterialCommunityIcons name="access-point-network" color='white' size={24} />
        )}
        style={styles.fab}
        onPress={() => pingMutation.mutate()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#3F51B5',                                    
  },
});
