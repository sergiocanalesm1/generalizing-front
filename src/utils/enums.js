export const domains = [
  'Aerospace Engineering', 
  'Anthropology',
  'Arquitecture',
  'Art',
  'Biology',
  'Business',
  'Chemestry',
  'Computer Science',
  'Design',
  'Economics',
  'Education',
  'Electrical Engineering',
  'Law',
  'Literature',
  'Mathematics',
  'Mechanical Engineering',
  'Medicine',
  'Music',
  'Philosophy',
  'Physics',
  'Political Science',
  'Software Engineering',
  'Other'
];

export const origins = [
  "Article",
  "Book",
  "Film",
  "Interpretation",
  "Lecture",
  "Lesson",
  "Personal Experience",
  "Relation",
  "Song",
  "Theater Play",
  "Video",
  "Video Game",
  "Other"
];

export function tempRelations(){
    const relations = []
    for(let i=0; i<100; i++){
      const r = {
        id: i,
        name: `Relation ${i}`,
        challenge: Math.random() > 0.75 ? 1 : undefined,
        explanation: 
        `
        Some say the blacker the berry, the sweeter the juice
        I say the darker the flesh then the deeper the roots
        I give a holler to my sisters on welfare
        Tupac cares, if don't nobody else care
        And uh, I know they like to beat ya down a lot
        When you come around the block brothas clown a lot
        But please don't cry, dry your eyes, never let up
        Forgive but don't forget, girl keep your head up
        And when he tells you you ain't nuttin' don't believe him
        And if he can't learn to love you, you should leave him
        'Cause sista you don't need him
        And I ain't tryin' to gas ya up, I just call 'em how I see 'em
        You know it makes me unhappy (what's that)
        When brothas make babies, and leave a young mother to be a pappy
        And since we all came from a woman
        Got our name from a woman and our game from a woman
        I wonder why we take from our women
        `,
        creation_date: "2022-03-22T11:50:01.604116-05:00",
        lessons:[
          {
            name:"lesson 1",
            creation_date: "2022-03-22T11:50:01.604116-05:00",
            domain: domains[Math.floor(Math.random() * 20)],
            origin: origins[Math.floor(Math.random() * 13)],
            description: 
            `
            That's just the way it is (Changes)
            Things'll never be the same
            That's just the way it is (That's the way it is, what?)
            Aww, yeah-yeah (Hear me)
            (Oh my, oh my, come on, come on)
            That's just the way it is (That's just the way it is, the way it is)
            Things'll never be the same
            (Never be the same, yeah, yeah, yeah, aww, yeah)
            That's just the way it is (Way it is)
            Aww, yeah (Come on, come on)
            `
          },
          {
            name:"lesson 2",
            creation_date: "2022-03-22T11:50:01.604116-05:00",
            domain: domains[Math.floor(Math.random() * 20)],
            origin: origins[Math.floor(Math.random() * 13)],
            description: 
            `
            Our conversation was short and sweet
            It nearly swept me off my feet
            And I'm back in the rain, oh
            And you are on dry land
            You made it there somehow
            You're a big girl now
            Bird on the horizon, sittin' on a fence
            He's singin' his song for me at his own expense
            And I'm just like that bird, oh
            Singin' just for you
            I hope that you can hear
            Hear me singin' through these tears
            `
          }
        ]
      }
      relations.push(r)
    }
    return relations
}

export const tempLasChallenge = {
  id: 1,
  creation_date:"2022-03-22T11:50:01.604116-05:00",
  lesson_1:{
    id:1,
    name:"lesson 1",
    creation_date: "2022-03-22T11:50:01.604116-05:00",
    domain: domains[Math.floor(Math.random() * 20)]
  },
  lesson_2:{
    id:2,
    name:"lesson 2",
    creation_date: "2022-03-22T11:50:01.604116-05:00",
    domain: domains[Math.floor(Math.random() * 20)]
  }
}