export const domains = [
    'Computer Science',
    'Physics',
    'Philosophy',
    'Design',
    'Art',
    'Electrical Engineering',
    'Software Engineering',
    'Aerospace Engineering',
    'Mechanical Engineering',
    'Biology',
    'Chemestry',
    'Mathematics',
    'Literature',
    'Music',
    'Law',
    'Business',
    'Economics',
    'Political Science',
    'Arquitecture',
    'Anthropology',
    'Medicine',
    'Education',
];

export const origins = [
    'Personal Experience',
    'Book',
    'Lecture',
    'Film',
    'Theater Play',
    'Video',
    'Video Game',
    'Song',
    'Article',
    'Relation',
    'Lesson',
    'Interpretation',
];

export function tempRelations(){
    const relations = []
    for(let i=0; i<100; i++){
      const r = {
        id: i,
        name: `Relation ${i}`,
        creation_date: "2022-03-22T11:50:01.604116-05:00",
        lessons:[
          {
            name:"lesson 1",
            creation_date: "2022-03-22T11:50:01.604116-05:00",
            domain: domains[Math.floor(Math.random() * 20)]
          },
          {
            name:"lesson 2",
            creation_date: "2022-03-22T11:50:01.604116-05:00",
            domain: domains[Math.floor(Math.random() * 20)]
          }
        ]
      }
      relations.push(r)
    }
    return relations
  }
    