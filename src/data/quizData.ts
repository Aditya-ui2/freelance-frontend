export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export const quizData: Record<string, Question[]> = {
  "React Architecture Pro": [
    { id: "r1", text: "What is the primary benefit of React Server Components (RSC)?", options: ["Zero client-side bundle for static content", "Faster client-side routing", "Automatic SEO optimization", "Better accessibility"], correctAnswer: 0 },
    { id: "r2", text: "In Clean Architecture, where should business logic reside?", options: ["UI Layer", "Data Source Layer", "Domain Layer (Entities/Use Cases)", "API Controller"], correctAnswer: 2 },
    { id: "r3", text: "What does the 'L' in SOLID stand for?", options: ["Layered Design", "Logical Partitioning", "Liskov Substitution Principle", "Linear Dependency"], correctAnswer: 2 },
    { id: "r4", text: "Which hook should be used for heavy calculations to avoid re-renders?", options: ["useEffect", "useMemo", "useCallback", "useRef"], correctAnswer: 1 },
    { id: "r5", text: "What is the main drawback of using context for global state?", options: ["Hard to debug", "Unnecessary re-renders of all consumers", "Limited storage", "Slow initial load"], correctAnswer: 1 },
    { id: "r6", text: "What is 'hydration' in React?", options: ["Adding data to a store", "Attaching event listeners to server-rendered HTML", "Cleaning up memory leaks", "Downloading images"], correctAnswer: 1 },
    { id: "r7", text: "Which pattern is best for decoupling a component from its data fetching?", options: ["Compound Components", "Render Props", "Container/Presenter Pattern", "Inline Styles"], correctAnswer: 2 },
    { id: "r8", text: "What is the benefit of using TypeScript with React?", options: ["Faster runtime execution", "Static type checking for props and state", "Automatic responsive design", "Built-in state management"], correctAnswer: 1 },
    { id: "r9", text: "What is a 'Pure Component'?", options: ["A component that has no styles", "A component that renders the same output for same props", "A component without a return statement", "A component that doesn't use hooks"], correctAnswer: 1 },
    { id: "r10", text: "How do you optimize an infinite scroll list?", options: ["Render all items at once", "Use Windowing/Virtualization", "Add more RAM", "Reduce image size"], correctAnswer: 1 },
    { id: "r11", text: "What does 'Lifting State Up' mean?", options: ["Moving state to a parent to share among children", "Storing state in LocalStorage", "Increasing the state priority", "Exporting state as a constant"], correctAnswer: 0 },
    { id: "r12", text: "Which tool is commonly used for React performance profiling?", options: ["Postman", "React DevTools", "Wireshark", "VS Code Search"], correctAnswer: 1 },
    { id: "r13", text: "What is the purpose of 'React.memo'?", options: ["To store variables permanently", "To memoize functional components to prevent unnecessary re-renders", "To create a secret memory store", "To speed up CSS loading"], correctAnswer: 1 },
    { id: "r14", text: "Which lifecycle method is equivalent to useEffect with an empty dependency array?", options: ["componentDidUpdate", "componentDidMount", "componentWillUnmount", "render"], correctAnswer: 1 },
    { id: "r15", text: "What is a 'Higher-Order Component' (HOC)?", options: ["A component with high priority", "A function that takes a component and returns a new component", "A component defined at the top of the file", "A component that uses hooks"], correctAnswer: 1 },
    { id: "r16", text: "What is the 'Virtual DOM'?", options: ["A direct copy of the HTML", "A lightweight representation of the real DOM in memory", "A 3D rendering engine", "A separate server for React"], correctAnswer: 1 },
    { id: "r17", text: "How do you provide a fallback UI during code splitting?", options: ["ErrorBoundary", "Suspense", "useEffect", "try/catch"], correctAnswer: 1 },
    { id: "r18", text: "What is the 'Key' prop used for in lists?", options: ["To style items individually", "To help React identify which items have changed", "To set the index of the item", "To store the item's password"], correctAnswer: 1 },
    { id: "r19", text: "Which hook provides access to the DOM node directly?", options: ["useState", "useRef", "useMemo", "useContext"], correctAnswer: 1 },
    { id: "r20", text: "What is 'Prop Drilling'?", options: ["Passing props through deep levels of component hierarchy", "Drilling holes in the screen", "Automatically generating props", "Renaming props"], correctAnswer: 0 }
  ],
  "UI/UX Design Masterclass": [
    { id: "u1", text: "What does 'Visual Hierarchy' refer to?", options: ["Number of colors used", "Arrangement of elements to show importance", "The file structure of CSS", "Font size matching"], correctAnswer: 1 },
    { id: "u2", text: "What is Fitts's Law?", options: ["Users read in an F-pattern", "User experience should be fast", "Time to hit a target depends on size and distance", "Designs should use 3 colors"], correctAnswer: 2 },
    { id: "u3", text: "What is the recommended minimum touch target size for mobile?", options: ["10px", "24px", "44x44px", "100px"], correctAnswer: 2 },
    { id: "u4", text: "What is 'White Space' in design?", options: ["Empty space between elements", "A background that must be white", "Missing content", "Unstyled text"], correctAnswer: 0 },
    { id: "u5", text: "Which color contrast ratio is required for AA accessibility (normal text)?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctAnswer: 2 },
    { id: "u6", text: "What is a 'Heuristic Evaluation'?", options: ["A coding test", "A usability audit based on design principles", "An A/B test", "A customer survey"], correctAnswer: 1 },
    { id: "u7", text: "What is the 'Golden Ratio' commonly used for?", options: ["Setting prices", "Defining layout proportions", "Counting users", "Naming files"], correctAnswer: 1 },
    { id: "u8", text: "What is 'Micro-copy'?", options: ["Small font text", "Short, helpful text for UI guidance", "Encrypted data", "Hidden labels"], correctAnswer: 1 },
    { id: "u9", text: "What is 'Affordance'?", options: ["Cost of the design", "Visual clues that suggest how an object is used", "Speed of the app", "Compatibility with IE11"], correctAnswer: 1 },
    { id: "u10", text: "What is the purpose of a 'Design System'?", options: ["To make the code longer", "Consistency, scalability, and efficiency", "To limit creativity", "To satisfy the CEO"], correctAnswer: 1 },
    { id: "u11", text: "What is 'Hick's Law'?", options: ["More options lead to faster decisions", "Time to make a decision increases with number of options", "Users never read everything", "Colors must be bright"], correctAnswer: 1 },
    { id: "u12", text: "What is a 'Wireframe'?", options: ["A high-fidelity mockup", "A low-fidelity blueprint of a page", "A 3D model", "Final code structure"], correctAnswer: 1 },
    { id: "u13", text: "In the 60-30-10 rule for color, what does 60 represent?", options: ["Accent Color", "Primary/Dominant Color", "Secondary Color", "Font Color"], correctAnswer: 1 },
    { id: "u14", text: "What is the 'Zeigarnik Effect'?", options: ["People remember completed tasks better", "People remember uncompleted tasks better", "Users prefer blue buttons", "Fast loading is critical"], correctAnswer: 1 },
    { id: "u15", text: "What is 'Skeuomorphism'?", options: ["Flat design", "Design that mimics real-world objects", "Animation-first design", "Text-only UI"], correctAnswer: 1 },
    { id: "u16", text: "What does 'Kerning' refer to?", options: ["Space between lines", "Space between individual characters", "Space between paragraphs", "Space around an image"], correctAnswer: 1 },
    { id: "u17", text: "What is 'Responsive Design'?", options: ["An app that responds to voice", "Layout that adapts to different screen sizes", "Fast server responses", "Interactive buttons"], correctAnswer: 1 },
    { id: "u18", text: "A user's 'Mental Model' is:", options: ["The app's source code", "How the user believes the system works", "The brain's processing speed", "A design template"], correctAnswer: 1 },
    { id: "u19", text: "Which font type is generally preferred for body text in digital interfaces?", options: ["Serif", "Sans-Serif", "Cursive", "Monospace"], correctAnswer: 1 },
    { id: "u20", text: "What is 'Dark Mode' primary benefit besides aesthetics?", options: ["Infinite battery", "Reduces eye strain in low-light", "Hides design flaws", "Faster page load"], correctAnswer: 1 }
  ],
  "Freelance Client Management": [
    { id: "c1", text: "What is the best way to handle 'Scope Creep'?", options: ["Work for free", "Ignore the client", "Use a Change Request/Addendum", "Cancel the project"], correctAnswer: 2 },
    { id: "c2", text: "What does 'Net 30' mean in an invoice?", options: ["30% discount", "Payment due in 30 days", "30 items included", "Pay in 30 installments"], correctAnswer: 1 },
    { id: "c3", text: "What is a 'Retainer'?", options: ["A dental tool", "A fixed fee paid in advance for ongoing services", "A type of tax", "A project manager"], correctAnswer: 1 },
    { id: "c4", text: "What is the first thing you should do when starting a project?", options: ["Start coding", "Send the invoice", "Sign a Contract/SOW", "Buy a domain"], correctAnswer: 2 },
    { id: "c5", text: "How should you handle an unhappy client?", options: ["Argue back", "Listen, empathize, and propose a solution", "Block them", "Refund immediately"], correctAnswer: 1 },
    { id: "c6", text: "What is 'Value-Based Pricing'?", options: ["Pricing based on time spent", "Pricing based on the result/ROI for the client", "Pricing 10% lower than competitors", "Asking the client for their budget"], correctAnswer: 1 },
    { id: "c7", text: "Why is a 'Discovery Call' important?", options: ["To talk about yourself", "To understand client needs and fit", "To set up a bank account", "To show off your portfolio"], correctAnswer: 1 },
    { id: "c8", text: "What should be included in a weekly update?", options: ["Progress, blockers, and next steps", "Just a list of bugs", "Your personal life", "The full source code"], correctAnswer: 0 },
    { id: "c9", text: "How do you protect yourself against non-payment?", options: ["Trust the client", "Take an upfront deposit (e.g. 50%)", "Work on a handshake", "Only work with friends"], correctAnswer: 1 },
    { id: "c10", text: "What is an 'NDA'?", options: ["Next Delivery Address", "Non-Disclosure Agreement", "New Design Asset", "Node Dependency Audit"], correctAnswer: 1 },
    { id: "c11", text: "What is 'Scope of Work' (SOW)?", options: ["A list of employee names", "Detailed description of project tasks and deliverables", "A map of the office", "The client's LinkedIn profile"], correctAnswer: 1 },
    { id: "c12", text: "How should you communicate a delay to the client?", options: ["Wait until the deadline passed", "Be proactive and explain before the deadline", "Never mention it", "Send a bigger invoice"], correctAnswer: 1 },
    { id: "c13", text: "What is a 'Deliverable'?", options: ["A pizza", "A tangible output provided to the client", "A type of email", "A marketing term for speed"], correctAnswer: 1 },
    { id: "c14", text: "What is the benefit of a 'Project Kickoff' meeting?", options: ["To drink coffee", "To align on goals, roles, and timeline", "To choose the app's logo", "To negotiate price again"], correctAnswer: 1 },
    { id: "c15", text: "What does 'ROI' stand for in client discussions?", options: ["Rate Of Interest", "Return On Investment", "Rules Of Interaction", "Real Original Idea"], correctAnswer: 1 },
    { id: "c16", text: "How do you handle 'Ghosting' from a client?", options: ["Spam them every hour", "Send a polite follow-up and define a timeline for next steps", "Ignore them forever", "Sue them immediately"], correctAnswer: 1 },
    { id: "c17", text: "What is a 'Kill Fee'?", options: ["An illegal payment", "A fee paid if the project is cancelled mid-way", "Cost of deleting files", "Late payment interest"], correctAnswer: 1 },
    { id: "c18", text: "Which tool is commonly used for project management asynchronously?", options: ["Twitch", "Asana/Trello/Linear", "Tinder", "Spotify"], correctAnswer: 1 },
    { id: "c19", text: "What is 'Active Listening'?", options: ["Listening while working", "Focusing fully, understanding, and responding thoughtfully", "Recording the call", "Interrupting with solutions"], correctAnswer: 1 },
    { id: "c20", text: "Why should you ask for a 'Testimonial' after completion?", options: ["To make the client work more", "To build social proof and attract new clients", "To fill space on the website", "To use as a screensaver"], correctAnswer: 1 }
  ]
};
