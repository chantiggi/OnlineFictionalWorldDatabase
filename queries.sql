-- add a new user (userType: 1=author, 0=reader, NO DEFAULT)
INSERT INTO `User`(`username`, `password`, `firstName`, `lastName`, `email`, `userType`) 
VALUES (?, ?, ?, ?, ?, ?)

-- add a new universe (published: 0=no, 1=yes -- default is 0/no)
INSERT INTO `Universe`(`univName`, `univDescription`) 
VALUES (?, ?)
-- associate universe with author (accessType: 1=primary, 0=secondary, NO DEFAULT)
INSERT INTO `AuthorUniverses`(`userID`, `universeID`, `accessType`) 
VALUES (?, ?, ?)
-- automatically create a "START" timeblock with prev and next initially pointing to NULL
-- automatically create an "END" timeblock with prev pointing to START and next pointing to NULL
-- after "END" is created, update "START"'s nextBlock to point to end

-- add a new chapter to universe
INSERT INTO `Chapter`(`chapterNum`, `chapterTitle`, `chapterSummary`, `univID`) 
VALUES (?, ?, ?, ?)

-- add a new location to universe
INSERT INTO `Location`(`locName`, `locDescription`, `univID`) 
VALUES (?, ?, ?)

-- add a new character to universe
INSERT INTO `Characters`(`firstName`, `lastName`, `description`, `univID`) 
VALUES (?, ?, ?, ?)

-- add a new time block (with previous and next) to universe
INSERT INTO `TimeBlocks`(`blockName`, `prevBlockID`, `nextBlockID`, `univID`) 
VALUES (?, ?, ?, ?)
--update the time block before this one to hold the new time block ID as it's "next"
--update the time block after this one to hold the new time block ID as it's "previous"

-- get all time blocks for universe (in order!!! - might need stored procedure)

-- add a new event to universe:
INSERT INTO `Event`(`eventName`, `eventDescription`, `eventTime`, `eventLocation`, `univID`) 
VALUES (?, ?, ?, ?, ?)

-- associate event with character:
INSERT INTO `EventCharacters`(`eventID`, `charID`, `charInvolvementDescr`) 
VALUES (?, ?, ?)

-- associate event with chapter:
INSERT INTO `ChapterEvents`(`chapterID`, `eventID`) 
VALUES (?, ?)

-- get all universes for specific author
SELECT un.universeID, un.univName, un.univDescription FROM Universe un
INNER JOIN AuthorUniverses au ON au.universeID = un.universeID
INNER JOIN User us ON us.userID = au.userID
WHERE us.userID = ?

-- get all chapters for specific universe
SELECT c.chapterID, c.chapterNum, c.chapterTitle, c.chapterSummary, c.univID FROM Chapter c
INNER JOIN Universe u ON u.universeID = c.univID
WHERE u.universeID = ?
ORDER BY c.chapterNum

-- get locations for specific universe
SELECT locID, locName, locDescription, univID FROM Location
INNER JOIN Universe u ON u.universeID = univID
WHERE u.universeID = ?

-- get characters for specific universe
SELECT charID, CONCAT(firstName, ' ', lastName) as charName, description, univID FROM Characters
INNER JOIN Universe u ON u.universeID = univID
WHERE u.universeID = ?

-- get events for specific universe
SELECT eventID, eventName, eventDescription, eventTime, eventLocation, univID FROM Event
WHERE univID = ?

-- get timeline for specific universe

---------- CHAPTER ----------
-- get info for specific chapter
SELECT chapterID, chapterNum, chapterTitle, chapterSummary, univID FROM Chapter
WHERE chapterID = ?

-- get locations for specific chapter
SELECT l.locID, l.locName FROM Location l
INNER JOIN Universe u ON u.universeID = l.univID
INNER JOIN Event e ON e.eventLocation = l.locID
INNER JOIN ChapterEvents ce ON ce.eventID = e.eventID
INNER JOIN Chapter c ON c.chapterID = ce.chapterID
WHERE c.chapterID = ?

-- get events for specific chapter
SELECT e.eventID, e.eventName FROM Event e
INNER JOIN ChapterEvents ce ON ce.eventID = e.eventID
INNER JOIN Chapter c ON c.chapterID = ce.chapterID
WHERE c.chapterID = ?

-- get characters for specific chapter
SELECT chara.charID, CONCAT(chara.firstName, ' ', chara.lastName) as charName FROM Characters chara
INNER JOIN EventCharacters ec ON ec.charID = chara.charID
INNER JOIN Event e ON e.eventID = ec.eventID
INNER JOIN ChapterEvents ce ON ce.eventID = e.eventID
INNER JOIN Chapter c ON c.chapterID = ce.chapterID
WHERE c.chapterID = ?

---------- LOCATION ----------
-- get info for specific location
SELECT locID, locName, locDescription, univID FROM Location 
WHERE locID = ?

-- get chapters for specific location
SELECT c.chapterID, c.chapterNum from Chapter c
INNER JOIN ChapterEvents ce ON ce.chapterID = c.chapterID
INNER JOIN Event e ON e.eventID = ce.eventID
INNER JOIN Location l on l.locID = e.eventLocation
WHERE locID = ?

-- get events for specific location
SELECT e.eventID, e.eventName FROM Event e
INNER JOIN Location l ON l.locID = e.eventLocation
WHERE locID = ?

-- get characters for specific location
SELECT c.charID, CONCAT(c.firstName, ' ', c.lastName) AS charName FROM Characters c
INNER JOIN EventCharacters ec ON ec.charID = c.charID
INNER JOIN Event e ON e.eventID = ec.eventID
INNER JOIN Location l ON l.locID = e.eventLocation
WHERE locID = ?

---------- EVENT ----------
-- get info for specific event
SELECT eventID, eventName, eventDescription, eventTime, eventLocation, univID FROM Event
WHERE eventID = ?

-- get chapters for specific event
SELECT c.chapterID, c.chapterNum FROM Chapter c
INNER JOIN ChapterEvents ce ON ce.chapterID = c.chapterID
INNER JOIN Event e ON e.eventID = ce.eventID
WHERE e.eventID = ?

-- get locations for specific event
SELECT l.locID, l.locName FROM Location l
INNER JOIN Event e ON e.eventLocation = l.locID
WHERE e.eventID = ?

-- get characters for specific event
SELECT c.charID, CONCAT(c.firstName, ' ', c.lastName) as charName FROM Characters c
INNER JOIN EventCharacters ec ON ec.charID = c.charID
INNER JOIN Event e ON e.eventID = ec.eventID
WHERE e.eventID = ?

---------- CHARACTER ----------
-- get info for specific character
SELECT charID, CONCAT(firstName, ' ', lastName) AS charName, description, univID FROM Characters
WHERE charID = ?

-- get chapters for specific character
SELECT chap.chapterID, chap.chapterNum FROM Chapter chap
INNER JOIN ChapterEvents ce ON ce.chapterID = chap.chapterID
INNER JOIN Event e ON e.eventID = ce.eventID
INNER JOIN EventCharacters ec ON ec.eventID = e.eventID
INNER JOIN Characters c ON c.charID = ec.charID
WHERE c.charID = ?

-- get locations for specific character
SELECT l.locID, l.locName FROM Location l
INNER JOIN Event e ON e.eventLocation = l.locID
INNER JOIN EventCharacters ec ON ec.eventID = e.eventID
INNER JOIN Characters c ON c.charID = ec.charID
WHERE c.charID = ?

-- get events for specific character
SELECT e.eventID, e.eventName FROM Event e
INNER JOIN EventCharacters ec ON ec.eventID = e.eventID
INNER JOIN Characters c ON c.charID = ec.charID
WHERE c.charID = ?