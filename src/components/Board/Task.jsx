import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

import Modal from "@components/Modal";
import TaskDetailModal from "@components/Modal/TaskDetailModal";
import DeleteTaskModal from "@components/Modal/DeleteTaskModal";
import { useBoards } from "@src/context";

const Task = ({ data, index }) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(data.title);
  const { deleteTask, updateTask } = useBoards();

  //number of completed subtasks
  const completedSubtasks = data.subtasks.reduce((acc, subtask) => subtask.isCompleted ? acc + 1 : acc, 0);

  const handleTitleUpdate = () => {
    if (titleInput.trim() === "") {
      setTitleInput(data.title);
    } else {
        data.title = titleInput
        updateTask(data);
    }
    setEditingTitle(false);
  };

  return (
    <Draggable draggableId={data.slug} index={index}>
      {(provided) => (
        <>
          <li
            className="group select-none shadow-main px-4 py-6 rounded-lg cursor-pointer bg-white text-black dark:bg-darkGrey dark:text-white relative"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={() => !editingTitle && setOpenTaskModal(false)}
          >
            {editingTitle ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-mainPurple"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTitleUpdate();
                }}
                onBlur={handleTitleUpdate}
              />
            ) : (
              <h4 className="heading-md mb-2 group-hover:text-mainPurple">{data.title}</h4>
            )}
            <p className="body-md text-mediumGrey">{completedSubtasks} of {data.subtasks.length} subtasks</p>
            {!editingTitle && (
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingTitle(true);
                  }}
                  className="focus:outline-none"
                >
                  <FontAwesomeIcon icon={faEdit} className="text-mainPurple" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModal(true);
                  }}
                  className="focus:outline-none"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-mainPurple" />
                </button>
              </div>
            )}
          </li>
          <Modal show={openTaskModal} onClose={() => setOpenTaskModal(false)}>
            <TaskDetailModal
              data={data}
              completedSubtasks={completedSubtasks}
              close={() => setOpenTaskModal(false)}
              switchToDelete={() => {
                setOpenTaskModal(false);
                setDeleteModal(true);
              }}
            />
          </Modal>
          <Modal show={deleteModal} onClose={() => setDeleteModal(!deleteModal)}>
            <DeleteTaskModal
              title={data.title}
              onClose={() => {
                setDeleteModal(false);
                setOpenTaskModal(false);
              }}
              onConfirm={() => {
                deleteTask(data.id);
                setDeleteModal(false);
              }}
            />
          </Modal>
        </>
      )}
    </Draggable>
  );
};

export default Task;

