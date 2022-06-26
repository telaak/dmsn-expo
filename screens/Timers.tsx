import React, { useEffect, useState } from "react";
import { LayoutAnimation, ScrollView, UIManager, View } from "react-native";
import { Button, List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
dayjs.extend(relativeTime);
dayjs.extend(duration);

const messages = [
  {
    type: "email",
    recipient: "Recipient 1",
    content: "content",
  },
  {
    type: "message",
    recipient: "Recipient 2",
    content: "content",
  },
  {
    type: "email",
    recipient: "Recipient 3",
    content: "content",
  },
  {
    type: "email",
    recipient: "Recipient 3",
    content: "content",
  },
  {
    type: "email",
    recipient: "Recipient 3",
    content: "content",
  },
  {
    type: "email",
    recipient: "Recipient 3",
    content: "content",
  },
];

const twelve = dayjs().add(12, "hours");

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
    <ScrollView>
      <List.Section title="Timers">
        <List.Accordion
          title={<CountdownTimer targetDate={targetDate} />}
          left={(props) => <List.Icon {...props} icon="clock" />}
          expanded={expanded}
          onPress={handlePress}
        >
          {messages.map((m, i) => {
            return (
              <List.Item
                right={(props) => <List.Icon {...props} icon={m.type} />}
                key={i}
                title={m.recipient}
                description={m.content.repeat(50)}
              />
            );
          })}
        </List.Accordion>
      </List.Section>
    </ScrollView>
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

export function Timers() {
  return (
    <AccordionList targetDate={twelve} messages={messages}></AccordionList>
  );
}
