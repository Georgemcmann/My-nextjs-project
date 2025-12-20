export interface Event {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: Event[] = [
  {
 image: "/images/event1.png",  
    title: "React Summit 2025",
   slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 12-13, 2025",
    time: "09:00 AM - 06:00 PM",
  },
  {
     image: "/images/event2.png",
    slug: "web3-dev-conference",
    title: "Web3 Dev Conference",
    location: "San Francisco, CA",
    date: "July 20-21, 2025",
    time: "10:00 AM - 05:00 PM",
  },
  {
  image: "/images/event3.png",
    title: "Next.js Conf 2025",
    slug: "nextjs-conf-2025",
    location: "Virtual",
    date: "August 5, 2025",
    time: "12:00 PM - 08:00 PM UTC",
  },
  {
    image: "/images/event4.png",
    title: "JavaScript Global Summit",
   
    slug: "js-global-summit",
    location: "Berlin, Germany",
    date: "September 15-17, 2025",
    time: "08:30 AM - 07:00 PM",
  },
  {
    image: "/images/event4.png",
    title: "DevOps Days NYC",
    slug: "devops-days-nyc",
    location: "New York, NY",
    date: "October 10-11, 2025",
    time: "09:00 AM - 05:30 PM",
  },
  {
   image: "/images/event4.png",
    title: "AI & ML Tech Expo",
    slug: "ai-ml-tech-expo",
    location: "Toronto, Canada",
    date: "November 8-9, 2025",
    time: "10:00 AM - 06:00 PM",
  },
];
