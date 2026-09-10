const fs = require('fs');

let content = fs.readFileSync('src/context/SchoolContext.tsx', 'utf8');

// 1. Remove Firebase imports
content = content.replace(/import \{[\s\S]*?\} from 'firebase\/firestore';\n/, '');
content = content.replace(/import \{[\s\S]*?\} from 'firebase\/auth';\n/, '');
content = content.replace(/import \{ db, auth, handleFirestoreError, OperationType \} from '\.\.\/firebase';\n/, '');

// 2. Add dataService imports
content = content.replace(
  "import * as ppdbService from '../services/ppdbService';",
  "import * as ppdbService from '../services/ppdbService';\nimport * as dataService from '../services/dataService';"
);

// 3. Remove firebase Auth listener
content = content.replace(/  \/\/ 2\. Auth Status Listener[\s\S]*?  \}, \[\]\);\n/g, '');

// 4. Update the data fetching (useEffect)
const newDataFetching = `
  // 1. Fetch all data from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          newsData, teachersData, galleryData, agendasData, 
          downloadsData, booksData, feedbacksData, studentsData, 
          alumniData, logsData
        ] = await Promise.all([
          dataService.newsService.getAll().catch(() => initialNews),
          dataService.teacherService.getAll().catch(() => initialTeachers),
          dataService.galleryService.getAll().catch(() => initialGallery),
          dataService.agendaService.getAll().catch(() => initialAgendas),
          dataService.downloadService.getAll().catch(() => initialDownloads),
          dataService.bookService.getAll().catch(() => initialBooks),
          dataService.feedbackService.getAll().catch(() => initialFeedbacks),
          dataService.studentService.getAll().catch(() => initialStudents),
          dataService.alumniService.getAll().catch(() => initialAlumni),
          dataService.logService.getAll().catch(() => initialActivityLogs)
        ]);
        
        newsData.sort((a, b) => b.date.localeCompare(a.date));
        logsData.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

        setNews(newsData.length ? newsData : initialNews);
        setTeachers(teachersData.length ? teachersData : initialTeachers);
        setGallery(galleryData.length ? galleryData : initialGallery);
        setAgendas(agendasData.length ? agendasData : initialAgendas);
        setDownloads(downloadsData.length ? downloadsData : initialDownloads);
        setBooks(booksData.length ? booksData : initialBooks);
        setFeedbacks(feedbacksData.length ? feedbacksData : initialFeedbacks);
        setStudents(studentsData.length ? studentsData : initialStudents);
        setAlumni(alumniData.length ? alumniData : initialAlumni);
        setActivityLogs(logsData.length ? logsData : initialActivityLogs);
      } catch (error) {
        console.error("Failed to fetch data from MongoDB:", error);
      }
    };
    fetchData();
  }, []);
`;

content = content.replace(/  \/\/ 1\. Listen to real-time changes in Firestore[\s\S]*?    \};\n  \}, \[\]\);\n/, newDataFetching);

// 5. Update CRUD Operations
content = content.replace(/  const signInWithGoogle = async \(\) => \{[\s\S]*?  \};\n/, '');
content = content.replace(/signOut\(auth\)\.catch[^\n]*\n/, '');

// Replace all setDoc/deleteDoc/updateDoc with API calls
const replacements = [
  { func: 'addActivityLog', service: 'logService', args: 'operatorName: string, role: \'Admin Utama\' | \'Staf Humas\' | \'OSIM\', action: string, details: string', obj: '{ operatorName, operatorRole: role, action, details, timestamp: new Date().toISOString() }', isLog: true },
  
  { func: 'addBook', service: 'bookService', type: 'Book' },
  { func: 'deleteBook', service: 'bookService', isDelete: true },
  { func: 'updateBook', service: 'bookService', isUpdate: true, type: 'Book' },
  
  { func: 'addStudent', service: 'studentService', type: 'Student' },
  { func: 'deleteStudent', service: 'studentService', isDelete: true },
  { func: 'updateStudent', service: 'studentService', isUpdate: true, type: 'Student' },
  
  { func: 'addAlumni', service: 'alumniService', type: 'Alumni' },
  { func: 'deleteAlumni', service: 'alumniService', isDelete: true },
  { func: 'updateAlumni', service: 'alumniService', isUpdate: true, type: 'Alumni' },
  
  { func: 'addNews', service: 'newsService', type: 'NewsItem', extras: ", views: 0", omitType: "'id' | 'views'" },
  { func: 'deleteNews', service: 'newsService', isDelete: true },
  { func: 'updateNews', service: 'newsService', isUpdate: true, type: 'NewsItem' },
  
  { func: 'addTeacher', service: 'teacherService', type: 'Teacher' },
  { func: 'deleteTeacher', service: 'teacherService', isDelete: true },
  { func: 'updateTeacher', service: 'teacherService', isUpdate: true, type: 'Teacher' },
  
  { func: 'addGalleryItem', service: 'galleryService', type: 'GalleryItem' },
  { func: 'deleteGalleryItem', service: 'galleryService', isDelete: true },
  
  { func: 'addAgenda', service: 'agendaService', type: 'AcademicAgenda' },
  { func: 'deleteAgenda', service: 'agendaService', isDelete: true },
  { func: 'updateAgenda', service: 'agendaService', isUpdate: true, type: 'AcademicAgenda' },
  
  { func: 'addDownloadFile', service: 'downloadService', type: 'DownloadFile', extras: ", downloadsCount: 0", omitType: "'id' | 'downloadsCount'" },
  { func: 'deleteDownloadFile', service: 'downloadService', isDelete: true },
  { func: 'updateDownloadFile', service: 'downloadService', isUpdate: true, type: 'DownloadFile' },
  
  { func: 'submitFeedback', service: 'feedbackService', type: 'MessageFeedback', extras: ", createdAt: new Date().toISOString(), read: false", omitType: "'id' | 'createdAt' | 'read'" },
  { func: 'deleteFeedback', service: 'feedbackService', isDelete: true },
];

for (const rep of replacements) {
  let regex = new RegExp(\`  const \${rep.func} = [\\s\\S]*?\\};\\n\`);
  let newFunc = '';
  
  if (rep.isLog) {
    newFunc = \`  const \${rep.func} = (\${rep.args}) => {
    dataService.\${rep.service}.create(\${rep.obj} as any).then(data => setActivityLogs(prev => [data, ...prev])).catch(console.error);
  };\n\`;
  } else if (rep.isDelete) {
    newFunc = \`  const \${rep.func} = (id: string) => {
    dataService.\${rep.service}.delete(id).then(() => { window.location.reload(); }).catch(console.error);
  };\n\`;
  } else if (rep.isUpdate) {
    newFunc = \`  const \${rep.func} = (id: string, item: Partial<\${rep.type}>) => {
    dataService.\${rep.service}.update(id, item).then(() => window.location.reload()).catch(console.error);
  };\n\`;
  } else {
    newFunc = \`  const \${rep.func} = (item: Omit<\${rep.type}, \${rep.omitType || "'id'"}>) => {
    dataService.\${rep.service}.create({ ...item\${rep.extras || ''} } as any).then(() => window.location.reload()).catch(console.error);
  };\n\`;
  }
  
  content = content.replace(regex, newFunc);
}

// Additional specific replacements
content = content.replace(/  const incrementDownload =[\s\S]*?\};\n/, \`  const incrementDownload = (id: string) => {
    const file = downloads.find(d => d.id === id);
    if(file) dataService.downloadService.update(id, { downloadsCount: file.downloadsCount + 1 }).catch(console.error);
  };\n\`);

content = content.replace(/  const markFeedbackRead =[\s\S]*?\};\n/, \`  const markFeedbackRead = (id: string) => {
    dataService.feedbackService.update(id, { read: true }).then(() => window.location.reload()).catch(console.error);
  };\n\`);

// Also remove signInWithGoogle from Context return
content = content.replace(/signInWithGoogle,\\n/g, '');
content = content.replace(/signInWithGoogle: \(\) => Promise<void>;\\n/g, '');

fs.writeFileSync('src/context/SchoolContext.tsx', content);
console.log("SchoolContext.tsx updated!");
