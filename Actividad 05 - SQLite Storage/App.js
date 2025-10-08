import { StyleSheet, Text, View, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import{SQLiteProvider, useSQLiteContext} from 'expo-sqlite';
import{SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'

const initDatabase = async (db) => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task TEXT
      );
    `);
    console.log("Database generated")
  } catch (error){
  console.log(error)
  }
}

export default function App() {
  return (
    <SQLiteProvider databaseName = "tasks.db" onInit={initDatabase}>
      <TaskScreen />
    </SQLiteProvider>
  );
}

// TaskScreen component (Single screen for task management)
const TaskScreen = () => {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const db = useSQLiteContext();

    const addTask = async () => {
      try {
        await db.runAsync("INSERT INTO tasks (task) VALUES (?)", [task]);
        setTask("");
        loadTasks();

      } catch (error){
        console.log(error);
      }
    }

  const deleteTask = async (id) => {
    try {
      await db.runAsync("DELETE FROM tasks WHERE id = ?", [id]);
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

    const loadTasks = async () => {
      try{
        const results = await db.getAllAsync("SELECT * FROM tasks");
        console.log(results);
        setTasks(results)
      } catch (error){
        console.log(error);
      }
    }

    useEffect(() => {
      loadTasks();

    }, []);
 


      return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Task Manager</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task"
          value={task}
          onChangeText={setTask}
        />
        <Pressable style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Add Task</Text>
        </Pressable>
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.taskContainer}>
              <Text style={styles.taskText}>{item.task}</Text>
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginVertical: 5,
        borderRadius: 5,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        marginVertical: 10,
        width: '100%',
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
        width: '100%',
    },
    taskText: {
        fontSize: 18,
    },
    deleteButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
    }
});