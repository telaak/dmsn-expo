import React, { useEffect, useState } from "react";
import { LayoutAnimation, ScrollView, UIManager, View } from "react-native";
import { Button, List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { ContactContext } from "../App";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const AccordionList = ({
  targetDate,
  messages,
}: {
  targetDate: dayjs.Dayjs;
  messages: any;
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <List.Accordion
      title={<CountdownTimer targetDate={targetDate} />}
      left={(props) => <List.Icon {...props} icon="clock" />}
      expanded={expanded}
      onPress={handlePress}
    >
      {messages.map((m, i) => {
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

  return <Text>{dayjs.duration(target).format("HH[h] mm[m] ss[s]")}</Text>;
};

function TimersList({ contacts }) {
  const durations: Set<number> = new Set();
  contacts.forEach((c) => c.messages.forEach((m) => durations.add(m.duration)));
  const durationMessages = Array.from(durations).map((d) => {
    const dateMessages: any[] = [];
    contacts.forEach((c) => {
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
    <ScrollView>
      <List.Section title="Timers">
        {durationMessages.map((dm, i) => (
          <AccordionList
            key={i}
            messages={dm.messages}
            targetDate={dayjs().add(dayjs.duration(dm.duration))}
          />
        ))}
      </List.Section>
    </ScrollView>
  );
}

export function Timers() {
  return (
    <ContactContext.Consumer>
      {(contacts) => (
        <View>
          <TimersList contacts={contacts} />
        </View>
      )}
    </ContactContext.Consumer>
  );
}
