import React, { useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from 'react-modal'

interface DeleteAllButtonProps {
  onDeleteAll: () => void
}

Modal.setAppElement('#root')

const DeleteAllButton: React.FC<DeleteAllButtonProps> = ({ onDeleteAll }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false)

  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleConfirmDelete = () => {
    onDeleteAll()
    closeModal()
    window.location.reload() // Reload the page to show the welcome screen
  }

  return (
    <>
      <button
        onClick={openModal}
        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label="מחק הכל"
      >
        <Trash2 size={20} />
      </button>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="אישור מחיקת הכל"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-xl font-semibold mb-4">האם אתה בטוח שברצונך למחוק הכל?</h2>
          <p className="mb-6 text-gray-600">פעולה זו תמחק את כל המכשירים, כל הדיווחים בכל התאריכים, ואת שמך. תצטרך להזין את שמך מחדש. לא ניתן לבטל פעולה זו.</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
            >
              ביטול
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              כן, מחק הכל
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default DeleteAllButton