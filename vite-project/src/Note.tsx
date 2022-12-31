import { useNote } from "./NoteLayout"
import { Link } from "react-router-dom"
import { Badge } from "react-bootstrap"

export type NoteProps = {
    deleteNote: (id: string) => void
}

export function Note({deleteNote}: NoteProps){

    const note = useNote()
    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <div>
                            <h1>{note.title}</h1>
                        </div>
                        <div>
                            {note.tags.map(tag => {
                                return (
                                    <Badge className="text-truncate me-1" key={tag.id}>
                                        {tag.label}
                                    </Badge>
                                )
                            })}
                        </div>
                    </div>
                    <div>
                        <Link to={`/${note.id}/edit`}>
                            <button className="btn btn-primary me-2">Edit</button>
                        </Link>
                        <button className="btn border-danger me-2 text-danger" onClick={() => deleteNote(note.id)}>Delete</button>
                        <Link to="..">
                            <button className="btn border-secondary text-muted">Back</button>
                        </Link>
                    </div>
            </div>
            <div className="mt-3">
                    <p>{note.title}</p>
            </div>
        </>
    )
}