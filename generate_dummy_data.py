#!/usr/bin/env python3
import csv
import random
import datetime
import uuid
import os
from typing import List, Dict, Any

# Define the output directory
OUTPUT_DIR = "/home/ubuntu/DeploymentApp/AttendanceTracker/dummy_data"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Read the template data
def read_csv_template(file_path: str) -> List[Dict[str, str]]:
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        return list(reader)

# Generate random dates within a range
def random_date(start_date: datetime.date, end_date: datetime.date) -> str:
    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)
    return random_date.strftime("%Y-%m-%d")

# Generate Sites data
def generate_sites(template_sites: List[Dict[str, str]], num_sites: int = 10) -> List[Dict[str, str]]:
    sites = []
    
    # Include template sites
    for site in template_sites:
        sites.append({
            "Site ID": site["Site ID"],
            "Site Name": site["Site Name"],
            "Session Name": site["Session Name"],
            "Session ID": site["Session ID"]
        })
    
    # Generate additional sites
    locations = [
        "Downtown Community Center", "Westside Library", "Eastside Recreation Center",
        "Southpark Youth Hub", "North Hills Senior Center", "Riverside Park Pavilion",
        "Mountain View School", "Lakeside Arts Center", "Central Sports Complex",
        "Sunset Beach Club", "Valley Medical Center", "Highland Church",
        "Meadowbrook Gardens", "Pinecrest Lodge", "Oakwood University"
    ]
    
    session_types = [
        "Morning Workshop", "Afternoon Class", "Evening Meetup", "Weekend Seminar",
        "Lunch & Learn", "Tech Talk", "Art Class", "Fitness Session", "Book Club",
        "Coding Bootcamp", "Yoga Class", "Music Lessons", "Dance Workshop",
        "Science Lab", "Language Exchange"
    ]
    
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    for i in range(len(sites), num_sites):
        site_id = f"site{i+1:03d}"
        location = random.choice(locations)
        locations.remove(location)  # Ensure unique locations
        
        day = random.choice(days)
        session_type = random.choice(session_types)
        session_types.remove(session_type)  # Ensure unique session types
        
        session_name = f"{day} {session_type}"
        session_id = f"s{i+1:03d}_{day.lower()}"
        
        sites.append({
            "Site ID": site_id,
            "Site Name": location,
            "Session Name": session_name,
            "Session ID": session_id
        })
    
    return sites

# Generate People data
def generate_people(template_people: List[Dict[str, str]], num_volunteers: int = 15, num_participants: int = 30) -> List[Dict[str, str]]:
    people = []
    
    # Include template people
    for person in template_people:
        people.append({
            "Person ID": person["Person ID"],
            "Full Name": person["Full Name"],
            "Type": person["Type"]
        })
    
    # Generate additional volunteers
    first_names = [
        "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
        "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph",
        "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy",
        "Daniel", "Lisa", "Matthew", "Betty", "Anthony", "Dorothy", "Mark", "Sandra",
        "Donald", "Ashley", "Steven", "Kimberly", "Paul", "Donna", "Andrew", "Emily",
        "Joshua", "Michelle", "Kenneth", "Amanda", "Kevin", "Melissa", "Brian", "Deborah",
        "George", "Stephanie", "Timothy", "Rebecca", "Ronald", "Laura", "Jason", "Sharon",
        "Edward", "Cynthia", "Jeffrey", "Kathleen", "Ryan", "Amy", "Jacob", "Shirley"
    ]
    
    last_names = [
        "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson",
        "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
        "Thompson", "Garcia", "Martinez", "Robinson", "Clark", "Rodriguez", "Lewis", "Lee",
        "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez",
        "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
        "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans",
        "Edwards", "Collins", "Stewart", "Sanchez", "Morris", "Rogers", "Reed", "Cook",
        "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson", "Cox"
    ]
    
    # Count existing volunteers and participants
    existing_volunteers = sum(1 for p in people if p["Type"] == "Volunteer")
    existing_participants = sum(1 for p in people if p["Type"] == "Participant")
    
    # Generate additional volunteers
    for i in range(existing_volunteers, num_volunteers):
        person_id = f"v{i+1:03d}"
        full_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        people.append({
            "Person ID": person_id,
            "Full Name": full_name,
            "Type": "Volunteer"
        })
    
    # Generate additional participants
    for i in range(existing_participants, num_participants):
        person_id = f"p{i+1:03d}"
        full_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        people.append({
            "Person ID": person_id,
            "Full Name": full_name,
            "Type": "Participant"
        })
    
    return people

# Generate Registered Attendees data
def generate_registered_attendees(sites: List[Dict[str, str]], people: List[Dict[str, str]], 
                                 template_registered: List[Dict[str, str]]) -> List[Dict[str, str]]:
    registered = []
    
    # Include template registrations
    for reg in template_registered:
        registered.append({
            "Site ID": reg["Site ID"],
            "Session ID": reg["Session ID"],
            "Person ID": reg["Person ID"],
            "Full Name": reg["Full Name"],
            "Type": reg["Type"]
        })
    
    # Get volunteers and participants
    volunteers = [p for p in people if p["Type"] == "Volunteer"]
    participants = [p for p in people if p["Type"] == "Participant"]
    
    # Ensure each site has at least one volunteer and some participants
    for site in sites:
        site_id = site["Site ID"]
        session_id = site["Session ID"]
        
        # Check if this site already has registrations
        existing_registrations = [r for r in registered if r["Site ID"] == site_id]
        if existing_registrations:
            continue
        
        # Assign 1-2 volunteers per site
        num_volunteers = random.randint(1, 2)
        for _ in range(num_volunteers):
            if not volunteers:
                break
            volunteer = random.choice(volunteers)
            volunteers.remove(volunteer)  # Each volunteer is assigned to only one site
            
            registered.append({
                "Site ID": site_id,
                "Session ID": session_id,
                "Person ID": volunteer["Person ID"],
                "Full Name": volunteer["Full Name"],
                "Type": volunteer["Type"]
            })
        
        # Assign 3-8 participants per site
        num_participants = random.randint(3, 8)
        site_participants = random.sample(participants, min(num_participants, len(participants)))
        
        for participant in site_participants:
            registered.append({
                "Site ID": site_id,
                "Session ID": session_id,
                "Person ID": participant["Person ID"],
                "Full Name": participant["Full Name"],
                "Type": participant["Type"]
            })
    
    return registered

# Generate Attendance Logs
def generate_attendance_logs(registered_attendees: List[Dict[str, str]], sites: List[Dict[str, str]], 
                            num_days: int = 30) -> List[Dict[str, str]]:
    logs = []
    
    # Get today's date and calculate the start date (num_days ago)
    end_date = datetime.date.today()
    start_date = end_date - datetime.timedelta(days=num_days)
    
    # Generate attendance logs for each day in the range
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime("%Y-%m-%d")
        
        # For each site, generate attendance for registered attendees
        for site in sites:
            site_id = site["Site ID"]
            session_id = site["Session ID"]
            session_name = site["Session Name"]
            
            # Get attendees registered for this site
            site_attendees = [a for a in registered_attendees if a["Site ID"] == site_id]
            
            # Skip if no attendees for this site
            if not site_attendees:
                continue
            
            # Determine if session runs on this day of the week
            day_of_week = current_date.strftime("%a").lower()
            if day_of_week not in session_id.lower():
                continue  # Skip if session doesn't run on this day
            
            # Generate attendance for each registered attendee
            for attendee in site_attendees:
                # 80% chance of being present
                status = "Present" if random.random() < 0.8 else "Absent"
                
                logs.append({
                    "id": str(uuid.uuid4()),
                    "timestamp": f"{date_str}T{random.randint(8, 17):02d}:{random.randint(0, 59):02d}:00",
                    "siteId": site_id,
                    "sessionId": session_id,
                    "sessionName": session_name,
                    "attendanceDate": date_str,
                    "personId": attendee["Person ID"],
                    "personName": attendee["Full Name"],
                    "personType": attendee["Type"],
                    "status": status
                })
        
        current_date += datetime.timedelta(days=1)
    
    return logs

# Write data to CSV files
def write_csv(data: List[Dict[str, str]], file_path: str, fieldnames: List[str] = None):
    if not fieldnames:
        fieldnames = data[0].keys()
    
    with open(file_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)

# Write data to JSON file
def write_json(data: List[Dict[str, str]], file_path: str):
    import json
    with open(file_path, 'w') as f:
        json.dump(data, f, indent=2)

# Main function
def main():
    # Read template data
    template_sites = read_csv_template("/home/ubuntu/upload/Sites(1).csv")
    template_people = read_csv_template("/home/ubuntu/upload/Master_People_List(1).csv")
    template_registered = read_csv_template("/home/ubuntu/upload/Registered_Attendees(1).csv")
    
    # Generate data
    sites = generate_sites(template_sites, num_sites=10)
    people = generate_people(template_people, num_volunteers=15, num_participants=30)
    registered_attendees = generate_registered_attendees(sites, people, template_registered)
    attendance_logs = generate_attendance_logs(registered_attendees, sites, num_days=60)
    
    # Write data to CSV files
    write_csv(sites, f"{OUTPUT_DIR}/sites.csv")
    write_csv(people, f"{OUTPUT_DIR}/people.csv")
    write_csv(registered_attendees, f"{OUTPUT_DIR}/registered_attendees.csv")
    
    # Write attendance logs to JSON (for easier import into the application)
    write_json(attendance_logs, f"{OUTPUT_DIR}/attendance_logs.json")
    
    # Also write attendance logs to CSV for reference
    write_csv(attendance_logs, f"{OUTPUT_DIR}/attendance_logs.csv")
    
    print(f"Generated {len(sites)} sites")
    print(f"Generated {len(people)} people")
    print(f"Generated {len(registered_attendees)} registered attendees")
    print(f"Generated {len(attendance_logs)} attendance logs")

if __name__ == "__main__":
    main()

