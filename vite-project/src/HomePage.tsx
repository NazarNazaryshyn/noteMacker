import { Link } from "react-router-dom"
import ReactSelect  from "react-select/" 
import { Note, NoteData, RawNoteData, Tag } from "./App"
import { Badge, Modal, Form, Stack, Button, Col, Row } from "react-bootstrap"
import { useMemo, useState } from "react"

export type HomePageProps = {
    availableTags: Tag[]
    notes:  Note[]
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

export type SimplifiedNote = {
    id: string
}

export function HomePage({ availableTags, notes, onUpdateTag, onDeleteTag }: HomePageProps){

    const [title, setTitle] = useState("")
    const [selectedTags, setSelectedTags] = useState<Tag[]>([])
    const [editTagsModalIsOpen, setEditTagsModalIsOpen] = useState(false)

    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === "" || note.title.toLowerCase().includes(title.toLowerCase())) &&
                (selectedTags.length === 0 || selectedTags.every(tag => {
                    note.tags.some(noteTag => noteTag.id === tag.id)
                }))
            )
        })
    }, [title, selectedTags, notes])

    return (
        <>  
            <div className="d-flex justify-content-between">
                <div>
                    <h1>Notes</h1>
                </div>    
                <div className="d-flex align-items-center">
                    <Link to="/new">
                        <button className="btn btn-primary">
                            Create
                        </button>
                    </Link>
                    <button className="btn border-secondary ms-2" onClick={() => setEditTagsModalIsOpen(true)}>
                        Edit tag
                    </button>
                </div>
            </div>    
            <div className="form-group mt-2">
                <label htmlFor="formControlForHomeTitle">Title</label>
                <input type="text" className="form-control" id="formControlForHomeTitle" onChange={e => setTitle(e.target.value)} required placeholder="Title..."/>
            </div>
            <ReactSelect className="mt-3" 
            value={selectedTags.map(tag => {
                return {label: tag.label, value: tag.id}
            })}
            options={availableTags.map(tag => {
                return {label: tag.label, value: tag.id}
            })}
            onChange={tags => {
                setSelectedTags(tags.map(tag => {
                    return {label: tag.label, id: tag.value}
                }))
            }}
            isMulti/>
            
            <div className="row">
               {filteredNotes.map(note => {
                return (
                    <div className="col col-sm-4 gy-3 d-flex flex-column bg border border-secondary mt-3">
                        <div className="col d-flex justify-content-center pt-5">
                            <Link to={`/${note.id}`} className="text-decoration-none">
                                <p className="fs-5 text-muted">{note.title}</p>
                            </Link>
                        </div>
                        <div className="d-flex align-items-center justify-content-center pb-5">
                            {note.tags.map(tag => {
                                return (
                                    <Badge className="text-truncate me-1" key={tag.id}>
                                        {tag.label}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                )   
               })}
            </div>
            <EditTagsModal
                onUpdateTag={onUpdateTag}
                onDeleteTag={onDeleteTag}
                show={editTagsModalIsOpen}
                handleClose={() => setEditTagsModalIsOpen(false)}
                availableTags={availableTags}
            />
        </>
    )
}   


export function NoteCard({id}: SimplifiedNote){
    return (
        <h1>{id}</h1>
    )
}

type EditTagsModalProps = {
    show: boolean
    availableTags: Tag[]
    handleClose: () => void
    onDeleteTag: (id: string) => void
    onUpdateTag: (id: string, label: string) => void
}

function EditTagsModal({
    availableTags,
    handleClose,
    show,
    onDeleteTag,
    onUpdateTag,
  }: EditTagsModalProps) {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Stack gap={2}>
              {availableTags.map(tag => (
                <Row key={tag.id}>
                  <Col>
                    <Form.Control
                      type="text"
                      value={tag.label}
                      onChange={e => onUpdateTag(tag.id, e.target.value)}
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      onClick={() => onDeleteTag(tag.id)}
                      variant="outline-danger"
                    >
                      &times;
                    </Button>
                  </Col>
                </Row>
              ))}
            </Stack>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }