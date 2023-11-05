import React, { Fragment, useEffect, useState } from "react";
import { View, StyleSheet, Text } from "@react-pdf/renderer";

export default function PDFTable({ data }) {

    const [tableData, setTableData] = useState();
    const styles = StyleSheet.create({
        columnView: {
            display: 'flex', flexDirection: 'row', borderTop: '1px solid #EEE', paddingTop: 8, paddingBottom: 8, textAlign: "center",
            fontSize: 13, 
        },
        rowView: {
            display: 'flex', flexDirection: 'row', borderTop: '1px solid #EEE', paddingTop: 8, paddingBottom: 8, textAlign: "center",
            fontSize: 10, 
        }
    });

    useEffect(() => {
        if (data !== undefined) setTableData(data);
    }, []);

    return (
        <>
            {tableData &&
                (
                    <Fragment>
                        <View style={styles.columnView}>
                            {tableData["column"].map((c,i) => <Text key={i} style={{
                                width: `${100 / tableData["column"].length}%`
                            }}>{c}</Text>)}
                        </View>
                        {tableData["data"].map((rowData,i) => <>
                            <View key={i} style={styles.rowView}>
                                {tableData["column"].map((c,i) =>
                                    <Text key={rowData} style={{ width: `${100 / tableData["column"].length}%` }}>{rowData[c]}</Text>
                                )}
                            </View>
                        </>)}
                    </Fragment>
                )}
        </>

    )
}