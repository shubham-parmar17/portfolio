import { github } from './profile';

export const projects = [
  {
    slug: 'agriequip', title: 'AgriEquip', num: '01',
    tagline: 'A platform for managing agricultural equipment.',
    stack: ['React', 'Node.js', 'MySQL', 'REST API'], color: '#2F6FDE', repo: github,
    sections: [
      { h: 'The problem', p: 'Farm machinery is expensive, and it costs even more when it sits broken. Tracking what exists, where it is, and when it needs attention is often done on paper or in spreadsheets.' },
      { h: 'What I built', p: 'A full-stack web app: a responsive React interface connected to a structured RESTful backend, with MySQL holding equipment records and maintenance alerts.' },
      { h: 'Architecture', p: 'A decoupled SPA client consuming REST endpoints, backed by normalized MySQL tables linking equipment units and maintenance logs.' },
      { h: 'Decisions', p: 'Kept the API modular and RESTful so the front end stays simple. Used relational data to model equipment and its maintenance records.' },
      { h: 'Outcome', p: 'Centralized equipment tracking and maintenance schedules with status updates, replacing spreadsheet-based tracking.' },
    ],
  },
  {
    slug: 'document-qa', title: 'Document Q&A with RAG', num: '02',
    tagline: 'Answers questions from your documents by retrieving relevant passages first.',
    stack: ['Python', 'Embeddings', 'Vector search', 'RAG'], color: '#1E9E6A', repo: github,
    sections: [
      { h: 'The problem', p: 'Language models can invent details. Grounding answers in a specific set of documents makes them checkable and verifiable.' },
      { h: 'What I built', p: 'A retrieval-augmented generation pipeline: split documents into chunks, embed them, retrieve the closest matches, and pass them to the model as context.' },
      { h: 'Architecture', p: 'Ingestion with overlapping semantic chunks, dense sentence embeddings, nearest-neighbor vector indexing, and dynamic context injection.' },
      { h: 'Decisions', p: 'Used overlapping chunks to retain context across boundaries and similarity filtering to keep answers grounded.' },
      { h: 'Outcome', p: 'A document question-answering workflow that can cite the source passages used to form an answer.' },
    ],
  },
];
