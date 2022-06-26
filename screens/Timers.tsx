import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { List } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const useCountdown = (targetDate) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountDown(countDownDate - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [countDownDate]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

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

const CountdownTimer = ({ targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  const [expanded, setExpanded] = React.useState(true);
  const handlePress = () => setExpanded(!expanded);

  return (
    <ScrollView>
      <List.Section title="Timers">
        <List.Accordion
          title={
            <ShowCounter
              days={days}
              hours={hours}
              minutes={minutes}
              seconds={seconds}
            />
          }
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

  /* if (days + hours + minutes + seconds <= 0) {
    return <View></View>;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  } */
};

export function Timers() {
  return <CountdownTimer targetDate={new Date().getTime() + 500000} />;
}

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <Text>
      {days}d {hours}h {minutes}m {seconds}s
    </Text>
  );
};

const DateTimeDisplay = ({
  value,
  type,
  isDanger,
}: {
  value: number;
  type: string;
  isDanger: boolean;
}) => {
  return (
    <View>
      <Text>{value + type}</Text>
    </View>
  );
};
