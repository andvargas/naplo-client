# Naplo React + TypeScript Rebuild Context

## Project Overview

I am rebuilding an older React/Redux time-tracking application called "Naplo" into a modern React + TypeScript + Vite application.

### Stack

- React 19
- TypeScript
- Vite
- React Router
- Axios
- TailwindCSS
- Node.js / Express backend
- MongoDB / Mongoose

### Folder Structure

.
├── Context.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── public
│   ├── favicon.svg
│   └── icons.svg
├── README.md
├── src
│   ├── api
│   │   ├── auth.ts
│   │   ├── axios.ts
│   │   ├── projects.ts
│   │   └── timelogs.ts
│   ├── App.tsx
│   ├── assets
│   ├── components
│   │   ├── ActivitySelector
│   │   │   └── ActivitySelector.tsx
│   │   ├── Modal
│   │   │   └── Modal.tsx
│   │   ├── Navbar
│   │   │   └── Navbar.tsx
│   │   ├── Projects
│   │   │   └── AddProjectForm.tsx
│   │   ├── Timelogs
│   │   │   ├── AddTimelog.tsx
│   │   │   ├── EditTimelog.tsx
│   │   │   └── Timelogs.tsx
│   │   └── Tooltip
│   │       └── Tooltip.tsx
│   ├── context
│   │   └── AuthContext.tsx
│   ├── hooks
│   │   └── useProjects.ts
│   ├── index.css
│   ├── main.tsx
│   ├── pages
│   │   ├── Dashboard.tsx
│   │   ├── DiaryEntryList.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── Projects.tsx
│   │   ├── Register.tsx
│   │   └── Timesheet.tsx
│   ├── types
│   │   └── index.ts
│   └── utils
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

---

## AuthContext

Authentication is working.

The logged-in user is available via:

ts const { user } = useAuth(); 

User interface:

ts export interface User {   id: string;   username: string;   email: string;   activityTypes: string[]; } 

The login API was updated so activityTypes are now included in the user object.

Example user:

json {   "id": "6a159c05fb8ff2b52100cb3c",   "username": "andre",   "email": "test@test.com",   "activityTypes": [     "Freelance",     "Study"   ] } 

---

## ActivitySelector Component

Purpose:

- Select Activity Type
- Select Project
- Select Customer
- Add Project button

Current implementation:

tsx <ActivitySelector   projects={projectNames}   customers={customers}   onAddProject={() => setShowAddProjectModal(true)} /> 

Activity types come from:

ts const activityTypes = user?.activityTypes ?? []; 

Projects and customers are passed in as props.

---

## Tooltip Component

Reusable component:

tsx <Tooltip label="Add new project">   <button>...</button> </Tooltip> 

Stored in:

text components/Tooltip/Tooltip.tsx 

---

## Modal Component

Reusable modal exists:

tsx <Modal   isOpen={showAddProjectModal}   title="Add Project"   onClose={() => setShowAddProjectModal(false)} >   ... </Modal> 

Stored in:

text components/Modal/Modal.tsx 

---

## Add Project Flow

### AddProjectForm

Reusable component.

Fields:

- projectName
- customer
- description

Uses:

ts onSubmit(data) 

where data is:

ts {   projectName: string;   customer: string;   description: string; } 

---

## Project API

File:

text src/api/projects.ts 

Contains:

ts getProjects() addProject() 

Current add endpoint:

ts POST /projects/add 

---

## Backend Route

js router.route("/add").post((req, res) => {   const projectName = req.body.projectName;   const username = req.body.username;   const description = req.body.description;   const customer = req.body.customer;   const statusActive = req.body.statusActive;    const newProject = new Project({     username,     projectName,     description,     customer,     statusActive,   });    newProject     .save()     .then(() => res.json("Project added"))     .catch((error) => res.status(400).json("Error " + error)); }); 

---

## Important Discovery

Originally schema had:

js username: {   type: String,   required: true,   default: "andras" } 

This caused all projects to be created under username "andras".

Default was removed.

Frontend now explicitly sends:

ts username: user.username 

and project creation works.

Also:

js statusActive: {   type: Boolean,   default: true } 

was added.

---

## Current Home.tsx

Home currently:

- fetches projects
- filters projects for logged-in user
- passes project names and customers to ActivitySelector
- opens Add Project modal

Projects are loaded with:

ts useEffect(() => {   if (!user) return;    const load = async () => {     const data = await getProjects();      const filtered = data.filter(       (p) => p.statusActive && p.username === user.username     );      setProjects(filtered);   };    load(); }, [user]); 

Derived values:

ts const projectNames = projects.map((p) => p.projectName);  const customers = [   ...new Set(projects.map((p) => p.customer)), ]; 

---
