import React, { useEffect } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { DataTable, FAB } from "react-native-paper";
import { Row, useSortBy, useTable } from "react-table";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { Menu, Divider } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { getDeleteContactMutation, getUser, IContact } from "../api/api";
import { useNavigation } from "@react-navigation/native";

export function ContactList() {
  const [testData, setTestData] = React.useState<IContact[] | never[]>(
    [] as IContact[]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone nr.",
        accessor: "phoneNumber",
      },
    ],

    [testData]
  );

  const { status, data, error, isSuccess } = useQuery("user", getUser);

  const getContacts = useEffect(() => {
    if (status === "success") {
      const contacts = data.contacts;
      setTestData(contacts);
    }
  }, [status, data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: columns, data: testData }, useSortBy);

  const getIcon = (
    isSorted: boolean
  ): React.ComponentProps<typeof MaterialIcons>["name"] => {
    if (typeof isSorted === "undefined") {
      return "";
    } else if (isSorted) {
      return "arrow-upward";
    } else {
      return "arrow-downward";
    }
  };

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <DataTable>
          {headerGroups.map((headerGroup, i) => (
            <DataTable.Header key={i}>
              {headerGroup.headers.map((column) => (
                <DataTable.Title
                  key={column.id}
                  onPress={() => column.toggleSortBy()}
                >
                  {column.render("Header")}
                  <MaterialIcons
                    name={getIcon(column.isSortedDesc)}
                    size={16}
                    color="black"
                  />
                </DataTable.Title>
              ))}
            </DataTable.Header>
          ))}
          {rows.map((row, i) => {
            prepareRow(row);
            return <RowView row={row} key={i} />;
          })}
        </DataTable>
      </ScrollView>
      <FAB
        icon={() => (
          <MaterialCommunityIcons name="plus" color="white" size={24} />
        )}
        style={styles.fab}
        onPress={() => navigation.navigate("ContactEdit", { new: true })}
      />
    </View>
  );
}

const RowView = (props: { row: Row<IContact> }) => {
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const [anchor, setAnchor] = React.useState({ x: 0, y: 0 });
  const navigation = useNavigation();
  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const deleteMutation = getDeleteContactMutation();

  return (
    <Pressable
      onLongPress={(s) => {
        const anchor = {
          x: s.nativeEvent.pageX,
          y: s.nativeEvent.pageY,
        };
        setAnchor(anchor);
        openMenu();
      }}
    >
      <View>
        <Menu visible={visible} onDismiss={closeMenu} anchor={anchor}>
          <Menu.Item
            icon={() => <MaterialIcons name="edit" size={24} />}
            onPress={() => {
              navigation.navigate("ContactEdit", {
                id: props.row.original._id,
              });
              closeMenu();
            }}
            title="Edit"
          />
          <Menu.Item
            icon={() => <MaterialIcons name="content-copy" size={24} />}
            onPress={() => {
              copyToClipboard(JSON.stringify(props.row.original));
              closeMenu();
            }}
            title="Copy"
          />
          <Divider />
          <Pressable
            onLongPress={() =>
              deleteMutation.mutate(props.row.original._id as string)
            }
          >
            <Menu.Item
              icon={() => <MaterialIcons name="delete" size={24} />}
              title="Delete"
            />
          </Pressable>
        </Menu>
      </View>
      <DataTable.Row>
        {props.row.cells.map((cell, i: number) => {
          return (
            <DataTable.Cell key={i}>
              <Text>{cell.value}</Text>
            </DataTable.Cell>
          );
        })}
      </DataTable.Row>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#3F51B5",
  },
});
