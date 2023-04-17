import Button from "@components/shared/Button"
import Modal from "@components/Modal";
import AddNewColumnModal from "@components/Modal/AddNewColumnModal";
import { useState } from "react";
const EmptyBoard = () => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <div className="flex flex-col justify-center items-center w-full h-full bg-lightGrey dark:bg-veryDarkGrey">
        <h2 className="heading-lg text-mediumGrey text-center">This board is empty. Create a new column to get started.</h2>
        <Button onClick={() => setOpenModal(true)} className="btn btn__primary btn-lg mt-6">+ Add New Column</Button>
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <AddNewColumnModal onClose={() => setOpenModal(false)}/>
        </Modal>
    </div>
  )
}
export default EmptyBoard
