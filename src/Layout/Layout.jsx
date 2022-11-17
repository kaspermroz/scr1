import React, { useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Box,
  Flex,
  Button,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";

export const Layout = () => {
  const [rows, setRows] = useState([]);

  console.log(rows);

  const handleAddRow = () => {
    setRows([
      ...rows,
      {
        name: `P${rows.length + 1}`,
        time: 5,
        period: 10,
      },
    ]);
  };

  const handleEditRow = (property, name, value) => {
    setRows(
      rows.map((row) => {
        if (row.name === name) {
          row[property] = Number(value);
        }
        return row;
      })
    );
  };

  const handleDeleteRow = (rowName) => {
    setRows(rows.filter(({ name }) => name !== rowName));
  };

  const handleStart = () => {
    console.log("start");
  };

  return (
    <Box p={4}>
      <Flex>
        <Box>
          <TableContainer>
            <Table variant="simple">
              <TableCaption>
                Dodaj proces za pomocą '+', wcisnij Start zeby rozpoczac
                dzialanie algorytmu
              </TableCaption>
              <Thead>
                <Tr>
                  <Th>Proces</Th>
                  <Th isNumeric>Czas wykonania</Th>
                  <Th isNumeric>Okres</Th>
                  <Th>
                    <Button ml={4} onClick={handleAddRow}>
                      +
                    </Button>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {rows.map(({ name, time, period }, index) => (
                  <Tr key={name}>
                    <Td>{name}</Td>
                    <Td isNumeric>
                      <Editable
                        defaultValue={time}
                        onSubmit={(value) => {
                          handleEditRow("time", name, value);
                        }}
                      >
                        <EditablePreview />
                        <EditableInput maxW="50px" />
                      </Editable>
                    </Td>
                    <Td isNumeric>
                      <Editable
                        defaultValue={period}
                        onSubmit={(value) => {
                          handleEditRow("time", name, value);
                        }}
                      >
                        <EditablePreview />
                        <EditableInput maxW="50px" />
                      </Editable>
                    </Td>
                    <Td>
                      {rows.length === 1 || index === rows.length - 1 ? (
                        <Button ml={4} onClick={() => handleDeleteRow(name)}>
                          -
                        </Button>
                      ) : null}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
        <Box>
          <Button colorScheme="teal" ml={4} onClick={handleStart}>
            Start
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
