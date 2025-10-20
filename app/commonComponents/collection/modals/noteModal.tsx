'use client';

import { Dispatch, SetStateAction } from "react";
import { NoteModalProps } from "../../utils/Types/collection";

export default function NoteModal({
  isOpen,
  isAnimating,
  selectedCollection,
  noteText,
  setNoteText,
  handleClose,
  handleSaveNote
}: NoteModalProps) {
  if (!isOpen || !selectedCollection) return null;

  return (
    <div
      className={`fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 transition-opacity duration-150 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative transition-all duration-150 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 text-black">
          {selectedCollection.note && selectedCollection.note.trim() !== "" ? "Edit Note" : "Add Note"} for {selectedCollection.name}
        </h2>
        <textarea
          className="w-full border border-gray-300 px-3 py-2 rounded mb-4 text-black"
          rows={4}
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            onClick={handleSaveNote}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
