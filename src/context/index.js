import firebase from '../firebase';
import { createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";


import stringToSlug from "@utils/stringToSlug";

const BoardContext = createContext();

function BoardProvider({ children }) {
  const [boards, setBoards] = useState([])
  const [firstTimeLoad,setFirstTimeLoad] = useState(true)
  const [loader,setLoader] = useState(false)
  const [userRef,setUserRef] = useState()
  useEffect(()=>{
      checkIfDocumentExists()
  },[])

        useEffect(()=>{
          
      
          if (!firstTimeLoad) {
            let data = {data:{boards:boards}}
             updateBoardData(data)
          }
          setFirstTimeLoad(false)
        
        },[setBoards,boards])

       const getLoaderStatus = ()=>{
          return loader?true:false
       }
       const setLoaderStatus = (status)=>{
        setLoader(status)
     }
        const updateBoardData = async (newData) => {
          
          try {
            const userId = await firebase.auth().currentUser.uid;
            await firebase.firestore().collection('users').doc(userId).update(newData);
            console.log('Data updated successfully');
          
          } catch (error) {
            console.error('Error updating data:', error);
          }
  
        };
        const checkIfDocumentExists = async () => {
          setLoader(true)
          console.log("Checking for Data");
          const userId = await firebase.auth().currentUser.uid;
          console.log(userId);
          const docRef = firebase.firestore().collection('users').doc(userId);
          setUserRef(docRef)
          const doc = await docRef.get();
          if (doc.exists) {
            console.log('Document data:', doc.data());
            setBoards(doc.data().data.boards)
            setLoader(false)
          } else {
            await docRef.set({
              data:data
            });
            console.log('Document created');
            setLoader(false)
          }
          setLoader(false)
        };
     
  // useLocalStorage("boards", data.boards);
  const [activeBoard, setActiveBoard] = useState(0);

  const currentBoard = boards[activeBoard];

  const columns = currentBoard?.columns;

  const createTask = (task) => {
    task.id = uuidv4();
    const column = columns.find((column) => column.name === task.status);
    task.status = column.name;
    task.subtasks = task.subtasks.map((subtask) => {
      return {
        ...subtask,
        isCompleted: false,
      };
    });
    task.slug = stringToSlug(task.title);
    // console.log("................Task.......................");
    // console.log(task);
    column.tasks.push(task.id);
    currentBoard.tasks.push(task);
    setBoards([...boards]);

  };

  const createColumn = (column) => {
    column.id = uuidv4();
    column.tasks = [];
    currentBoard.columns.push(column);
    setBoards([...boards]);
  };

  const createBoard = (board) => {
    console.log("HIIIII");
    board.id = uuidv4();
    let newColumns = [];
    newColumns = board.columns.filter((e) => e);
    newColumns.length
      ? (newColumns = newColumns.map((column) => {
          return {
            id: uuidv4(),
            name: column,
            tasks: [],
            slug: stringToSlug(column),
          };
        }))
      : null;
    console.log(newColumns);
    board.columns = newColumns;
    board.tasks = []

    // for (let i = 0; i < board.todoData.length; i++) {
    //   let task ={
    //     id:uuidv4(),
    //     status:"Todo",
    //     description:"",
    //     subtasks:[{title: 'Get Your Subtask done', isCompleted: false},{title: 'Get Your Subtask done', isCompleted: false}],
    //     title: board.todoData[i],
    //     slug: stringToSlug(board.todoData[i])
    //   }
    //   board.tasks.push(task)
    //   board.columns.map(column =>{
    //       if (column.name === task.status) {
    //         column.tasks.push(task.id)
    //       }
    //   })
    // }

    for (let i = 0; i < board.todoData.length; i++) {
      let task ={
        id:uuidv4(),
        status:"Todo",
        description:"",
        subtasks:[],
        title: board.todoData[i],
        slug: stringToSlug(board.todoData[i])
      }
      board.tasks.push(task)
      board.columns.map(column =>{
          if (column.name === task.status) {
            column.tasks.push(task.id)
          }
      })
    }

    for (let i = 0; i < board.backlogdata.length; i++) {
      let task ={
        id:uuidv4(),
        status:"Backlog",
        description:"",
        subtasks:[],
        title: board.backlogdata[i],
        slug: stringToSlug(board.backlogdata[i])
      }
      board.tasks.push(task)
      board.columns.map(column =>{
          if (column.name === task.status) {
            column.tasks.push(task.id)
          }
      })
    }
    
    setBoards(prevBoards => [...prevBoards, board]);
  };

  const updateTask = (updatedTask) => {
    const task = currentBoard.tasks.find((task) => task.id === updatedTask.id);
    task.title = updatedTask.title;
    task.subtasks = updatedTask.subtasks;
    task.slug = stringToSlug(task.title);
    if (updatedTask.status !== task.status) {
      const column = currentBoard.columns.find(
        (column) => column.name === updatedTask.status
      );
      const columnToRemove = currentBoard.columns.find(
        (column) => column.name === task.status
      );
      columnToRemove.tasks.splice(columnToRemove.tasks.indexOf(task.id), 1);
      column.tasks.push(task.id);
    }
    task.status = updatedTask.status;
    setBoards([...boards]);
  };

  const updateBoard = (updatedBoard) => {
    let newBoard = {
      ...currentBoard,
      name: updatedBoard.name,
      columns: updatedBoard.columns,
    };
    newBoard.columns.forEach((column, index) => {
      column.name = updatedBoard.columns[index].name;
      column.slug = stringToSlug(updatedBoard.columns[index].name);
    });

    const boardIndex = boards.findIndex((board) => board.id === newBoard.id);
    boards[boardIndex] = newBoard;
    setBoards([...boards]);
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const task = currentBoard.tasks.find((task) => task.id === taskId);
    const subtask = task.subtasks[subtaskId];
    subtask.isCompleted
      ? (subtask.isCompleted = false)
      : (subtask.isCompleted = true);
    setBoards([...boards]);
  };

  const changeTaskStatus = (taskId, status) => {
    const task = currentBoard.tasks.find((task) => task.id === taskId);
    const column = columns.find((column) => column.name === status);
    const prevColumn = columns.find((column) => column.name === task.status);
    prevColumn.tasks = prevColumn.tasks.filter((id) => id !== taskId);
    column.tasks.push(taskId);
    task.status = column.name;
    setBoards([...boards]);
  };

  const deleteTask = (taskId) => {
    const task = currentBoard.tasks.find((task) => task.id === taskId);
    const column = columns.find((column) => column.name === task.status);
    column.tasks = column.tasks.filter((id) => id !== taskId);
    console.log(currentBoard.tasks);
    currentBoard.tasks = currentBoard.tasks.filter(
      (task) => task.id !== taskId
    );
    setBoards([...boards]);
    console.log(boards);
  };

  const deleteBoard = (boardId) => {
    setActiveBoard(0);
    setBoards(boards.filter((board) => board.id !== boardId));
    // let boardArray = boards
    // console.log(boardArray);
    // let data = {data:{boards:boardArray}}
    // updateBoardData(data)
  };

  const dragTask = (source, destination) => {
    // dropped outside a column
    if (!destination) {
      return;
    }

    // if the source and destination are the same, do nothing
    if (
      source.droppableId === destination.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // If the card is moved within the same column and just needs an index change
    if (source.droppableId === destination.droppableId) {
      const column = columns.find(
        (column) => column.name === source.droppableId
      );
      const taskId = column.tasks[source.index];
      column.tasks.splice(source.index, 1);
      column.tasks.splice(destination.index, 0, taskId);
      setBoards([...boards]);
    }
    //If the card has been moved to a different column
    else {
      const column = columns.find(
        (column) => column.name === source.droppableId
      );
      const taskId = column.tasks[source.index];
      const draggedTask = currentBoard.tasks.find((task) => task.id === taskId);
      draggedTask.status = destination.droppableId;
      column.tasks.splice(source.index, 1);
      const newColumn = columns.find(
        (column) => column.name === destination.droppableId
      );
      newColumn.tasks.splice(destination.index, 0, taskId);
      setBoards([...boards]);
    }
  };

  const value = {
    boards,
    setBoards,
    currentBoard,
    columns,
    createBoard,
    createColumn,
    toggleSubtask,
    createTask,
    changeTaskStatus,
    updateTask,
    updateBoard,
    deleteTask,
    deleteBoard,
    dragTask,
    setActiveBoard,
    getLoaderStatus,
    setLoaderStatus
  };
  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

const useBoards = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoards must be used within a BoardProvider");
  }
  return context;
};

export { BoardProvider, useBoards };
