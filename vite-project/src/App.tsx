import "bootstrap/dist/css/bootstrap.min.css"
import { Routes, Route, Navigate } from "react-router-dom"
import { NewNote } from "./NewNote"
import { useLocalStorage } from "./useLocalStorage"
import { v4 as uuidV4} from "uuid"
import { HomePage } from "./HomePage"
import { useMemo } from "react"
import { NoteLayout } from "./NoteLayout"
import { Note } from "./Note"
import { EditNote } from "./EditNote"

export type Note = {
  id: string
} & NoteData

export type NoteData = {
  title: string
  body: string
  tags: Tag[]
}

export type Tag = {
  id: string
  label: string
}

export type RawNote = {
  id: string
}& RawNoteData

export type RawNoteData = {
  title: string
  body: string
  tagIds: string[]
}

export function App() {

  const [notes, setNotes] = useLocalStorage<RawNote[]>("NOTES", [])
  const [tags, setTags] = useLocalStorage<Tag[]>("TAGS", [])

  function onCreateNote({tags, ...data}: NoteData){
    setNotes(prevNotes => {
      return [...prevNotes, {...data, id: uuidV4(), tagIds: tags.map(tag => tag.id)}]
    })
  }
  
  function onAddTag(tag: Tag){
    setTags(prev => [...prev, tag])
  }

  const notesWithTags = useMemo(() => {
    return notes.map(note => {
      return {...note, tags: tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  }, [notes, tags])

  function deleteNote(id: string){
    setNotes(prevNotes => {
      return prevNotes.filter(note => note.id !== id)
    })
  }

  function editNote(id: string, { tags, ...data }: NoteData){
    setNotes(prevNotes => {
      prevNotes.map(note => {
        if (note.id === id){
          return { ...note, ...data, tagIds: tags.map(tag => tag.id)}
        }else{
          return note
        }
      })
    })
  }

  function updateTag(id: string, label: string) {
    setTags(prevTags => {
      return prevTags.map(tag => {
        if (tag.id === id) {
          return { ...tag, label }
        } else {
          return tag
        }
      })
    })
  }

  function deleteTag(id: string) {
    setTags(prevTags => {
      return prevTags.filter(tag => tag.id !== id)
    })
  }

  return (
    <div className="container my-4">
      <Routes>
          <Route path="/" element={<HomePage availableTags={tags} notes={notesWithTags} onDeleteTag={deleteTag} onUpdateTag={updateTag}/>} />
          <Route path="/new" element={<NewNote onSubmit={onCreateNote} onAddTag={onAddTag} availableTags={tags}/>}/>
          <Route path="/:id" element={<NoteLayout notes={notesWithTags}/>} >
            <Route index element={<Note deleteNote={deleteNote}/>} />
            <Route path="edit" element={<EditNote onSubmit={editNote} onAddTag={onAddTag} availableTags={tags}/>}/>
          </Route>  
          <Route path="/*" element={<Navigate to="/"/>}/>
      </Routes>
    </div>
  )
}

export default App
