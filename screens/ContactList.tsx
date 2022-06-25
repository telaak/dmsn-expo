import React from "react";
import { View } from "react-native";
import { DataTable } from "react-native-paper";

export class ContactList extends React.Component {
  state = {
    contacts: [],
    sortDirection: "ascending",
  };

  toggleDirection() {
      console.log('changing state')
    this.setState(() => {
      this.state.sortDirection = "descending";
    }, () => console.log(this.state.sortDirection));
  }

  render() {
    return (
      <View>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title
              onPress={() => this.toggleDirection()}
              sortDirection={this.state.sortDirection}
            >
              Dessert
            </DataTable.Title>
            <DataTable.Title numeric>Calories</DataTable.Title>
            <DataTable.Title numeric>Fat</DataTable.Title>
          </DataTable.Header>

          <DataTable.Row>
            <DataTable.Cell>Frozen yogurt</DataTable.Cell>
            <DataTable.Cell numeric>159</DataTable.Cell>
            <DataTable.Cell numeric>6.0</DataTable.Cell>
          </DataTable.Row>

          <DataTable.Row>
            <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
            <DataTable.Cell numeric>237</DataTable.Cell>
            <DataTable.Cell numeric>8.0</DataTable.Cell>
          </DataTable.Row>
        </DataTable>
      </View>
    );
  }
}
