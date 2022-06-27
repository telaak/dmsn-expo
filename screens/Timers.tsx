import React, { useEffect, useState } from "react";
import {
  LayoutAnimation,
  ScrollView,
  UIManager,
  View,
  StyleSheet,
} from "react-native";
import { Button, FAB, List } from "react-native-paper";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { ContactContext, IContact, IMessage, ITimerMessage } from "../App";
dayjs.extend(relativeTime);
dayjs.extend(duration);

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
            description={m.content.repeat(50)}
            descriptionNumberOfLines={3}
          />
        );
      })}
    </List.Accordion>
  );
};

const CountdownTimer = ({ targetDate }: { targetDate: dayjs.Dayjs }) => {
  const [target, setTarget] = React.useState(targetDate.diff(dayjs()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTarget(targetDate.diff(dayjs()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <Text>{formatDuration(dayjs.duration(target).toISOString())}</Text>;
};

const TimersList = ({ contacts }: { contacts: IContact[] }) => {
  const typedContacts: IContact[] = contacts;
  const durations: Set<number> = new Set();
  contacts.forEach((c: IContact) =>
    c.messages.forEach((m) => durations.add(m.duration))
  );
  const durationMessages = Array.from(durations).map((d) => {
    const dateMessages: any[] = [];
    contacts.forEach((c: IContact) => {
      c.messages.forEach((m) => {
        if (m.duration === d) {
          dateMessages.push({
            content: m.content,
            recipient: c.name,
            emailEnabled: c.emailEnabled,
            smsEnabled: c.smsEnabled,
          });
        }
      });
    });
    return {
      duration: d,
      messages: dateMessages,
    };
  });

  return (
    <List.Section title="Timers">
      {durationMessages.map((dm, i) => (
        <AccordionList
          key={i}
          messages={dm.messages}
          targetDate={dayjs().add(dayjs.duration(dm.duration))}
          duration={dm.duration}
        />
      ))}
    </List.Section>
  );
};

export function Timers() {
  return (
    <ContactContext.Consumer>
      {(contacts) => (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <TimersList contacts={contacts} />
          </ScrollView>
          <FAB
            icon={() => <MaterialCommunityIcons name="access-point-network" size={24} />}
            style={styles.fab}
            onPress={() => console.log("Pressed")}
          />
        </View>
      )}
    </ContactContext.Consumer>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
