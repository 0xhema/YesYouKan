import Modal from "@components/Modal";
import AddNewBoardModal from "@components/Modal/AddNewBoardModal";
import { useState } from "react";
const NoBoardsFound = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-lightGrey dark:bg-veryDarkGrey">
        <h2 className="heading-lg text-mediumGrey text-center">No Boards Found</h2>
        <button onClick={() => setOpen(true)} className="btn btn__primary btn-lg mt-6">Create a Board</button>
        <Modal show={open} onClose={() => setOpen(false)}>
            <AddNewBoardModal onClose={() => setOpen(false)} />
        </Modal>
    </div>
  )
}
export default NoBoardsFound
