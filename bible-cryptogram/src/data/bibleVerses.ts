export interface BibleVerse {
  text: string;
  reference: string;
}

export interface ChapterGroup {
  chapterTitle: string;
  chapterReference: string; // e.g., "1 Cor 10"
  verses: BibleVerse[];
}

export const BIBLE_VERSES: BibleVerse[] = [
  {
    text: "THEREFORE, MY DEAR FRIENDS, FLEE FROM IDOLATRY.",
    reference: "1 Cor 10:14"
  },
  {
    text: "I SPEAK TO SENSIBLE PEOPLE; JUDGE FOR YOURSELVES WHAT I SAY.",
    reference: "1 Cor 10:15"
  },
  {
    text: "IS NOT THE CUP OF THANKSGIVING FOR WHICH WE GIVE THANKS A PARTICIPATION IN THE BLOOD OF CHRIST?",
    reference: "1 Cor 10:16a"
  },
  {
    text: "AND IS NOT THE BREAD THAT WE BREAK A PARTICIPATION IN THE BODY OF CHRIST?",
    reference: "1 Cor 10:16b"
  },
  {
    text: "BECAUSE THERE IS ONE LOAF, WE, WHO ARE MANY, ARE ONE BODY, FOR WE ALL SHARE THE ONE LOAF.",
    reference: "1 Cor 10:17"
  },
  {
    text: "CONSIDER THE PEOPLE OF ISRAEL: DO NOT THOSE WHO EAT THE SACRIFICES PARTICIPATE IN THE ALTAR?",
    reference: "1 Cor 10:18"
  },
  {
    text: "DO I MEAN THEN THAT FOOD SACRIFICED TO AN IDOL IS ANYTHING, OR THAT AN IDOL IS ANYTHING?",
    reference: "1 Cor 10:19"
  },
  {
    text: "NO, BUT THE SACRIFICES OF PAGANS ARE OFFERED TO DEMONS, NOT TO GOD,",
    reference: "1 Cor 10:20a"
  },
  {
    text: "AND I DO NOT WANT YOU TO BE PARTICIPANTS WITH DEMONS.",
    reference: "1 Cor 10:20b"
  },
  {
    text: "YOU CANNOT DRINK THE CUP OF THE LORD AND THE CUP OF DEMONS TOO;",
    reference: "1 Cor 10:21a"
  },
  {
    text: "YOU CANNOT HAVE A PART IN BOTH THE LORD'S TABLE AND THE TABLE OF DEMONS.",
    reference: "1 Cor 10:21b"
  },
  {
    text: "ARE WE TRYING TO AROUSE THE LORD'S JEALOUSY? ARE WE STRONGER THAN HE?",
    reference: "1 Cor 10:22"
  },
  {
    text: '"I HAVE THE RIGHT TO DO ANYTHING" YOU SAY—BUT NOT EVERYTHING IS BENEFICIAL.',
    reference: "1 Cor 10:23a"
  },
  {
    text: "'I HAVE THE RIGHT TO DO ANYTHING'—BUT NOT EVERYTHING IS CONSTRUCTIVE.",
    reference: "1 Cor 10:23b"
  },
  {
    text: "NO ONE SHOULD SEEK THEIR OWN GOOD, BUT THE GOOD OF OTHERS.",
    reference: "1 Cor 10:24"
  },
  {
    text: "EAT ANYTHING SOLD IN THE MEAT MARKET WITHOUT RAISING QUESTIONS OF CONSCIENCE,",
    reference: "1 Cor 10:25"
  },
  {
    text: "FOR, 'THE EARTH IS THE LORD'S, AND EVERYTHING IN IT.'",
    reference: "1 Cor 10:26"
  },
  {
    text: "IF AN UNBELIEVER INVITES YOU TO A MEAL AND YOU WANT TO GO, EAT WHATEVER IS PUT BEFORE YOU WITHOUT RAISING QUESTIONS OF CONSCIENCE.",
    reference: "1 Cor 10:27"
  },
  {
    text: "BUT IF SOMEONE SAYS TO YOU, 'THIS HAS BEEN OFFERED IN SACRIFICE,' THEN DO NOT EAT IT,",
    reference: "1 Cor 10:28a"
  },
  {
    text: "BOTH FOR THE SAKE OF THE ONE WHO TOLD YOU AND FOR THE SAKE OF CONSCIENCE.",
    reference: "1 Cor 10:28b"
  },
  {
    text: "I AM REFERRING TO THE OTHER PERSON'S CONSCIENCE, NOT YOURS.",
    reference: "1 Cor 10:29a"
  },
  {
    text: "FOR WHY IS MY FREEDOM BEING JUDGED BY ANOTHER'S CONSCIENCE?",
    reference: "1 Cor 10:29b"
  },
  {
    text: "IF I TAKE PART IN THE MEAL WITH THANKFULNESS, WHY AM I DENOUNCED BECAUSE OF SOMETHING I THANK GOD FOR?",
    reference: "1 Cor 10:30"
  },
  {
    text: "SO WHETHER YOU EAT OR DRINK OR WHATEVER YOU DO, DO IT ALL FOR THE GLORY OF GOD.",
    reference: "1 Cor 10:31"
  },
  {
    text: "DO NOT CAUSE ANYONE TO STUMBLE, WHETHER JEWS, GREEKS OR THE CHURCH OF GOD—",
    reference: "1 Cor 10:32"
  },
  {
    text: "EVEN AS I TRY TO PLEASE EVERYONE IN EVERY WAY.",
    reference: "1 Cor 10:33a"
  },
  {
    text: "FOR I AM NOT SEEKING MY OWN GOOD BUT THE GOOD OF MANY, SO THAT THEY MAY BE SAVED.",
    reference: "1 Cor 10:33b"
  },
  {
    text: "FOLLOW MY EXAMPLE, AS I FOLLOW THE EXAMPLE OF CHRIST.",
    reference: "1 Cor 11:1"
  },
  {
    text: "I PRAISE YOU FOR REMEMBERING ME IN EVERYTHING AND FOR HOLDING TO THE TRADITIONS JUST AS I PASSED THEM ON TO YOU.",
    reference: "1 Cor 11:2"
  },
  {
    text: "BUT I WANT YOU TO REALIZE THAT THE HEAD OF EVERY MAN IS CHRIST, AND THE HEAD OF THE WOMAN IS MAN, AND THE HEAD OF CHRIST IS GOD.",
    reference: "1 Cor 11:3"
  },
  {
    text: "EVERY MAN WHO PRAYS OR PROPHESIES WITH HIS HEAD COVERED DISHONORS HIS HEAD.",
    reference: "1 Cor 11:4"
  },
  {
    text: "BUT EVERY WOMAN WHO PRAYS OR PROPHESIES WITH HER HEAD UNCOVERED DISHONORS HER HEAD—IT IS THE SAME AS HAVING HER HEAD SHAVED.",
    reference: "1 Cor 11:5"
  },
  {
    text: "FOR IF A WOMAN DOES NOT COVER HER HEAD, SHE MIGHT AS WELL HAVE HER HAIR CUT OFF;",
    reference: "1 Cor 11:6a"
  },
  {
    text: "BUT IF IT IS A DISGRACE FOR A WOMAN TO HAVE HER HAIR CUT OFF OR HER HEAD SHAVED, THEN SHE SHOULD COVER HER HEAD.",
    reference: "1 Cor 11:6b"
  },
  {
    text: "A MAN OUGHT NOT TO COVER HIS HEAD, SINCE HE IS THE IMAGE AND GLORY OF GOD; BUT WOMAN IS THE GLORY OF MAN.",
    reference: "1 Cor 11:7"
  },
  {
    text: "FOR MAN DID NOT COME FROM WOMAN, BUT WOMAN FROM MAN;",
    reference: "1 Cor 11:8"
  },
  {
    text: "NEITHER WAS MAN CREATED FOR WOMAN, BUT WOMAN FOR MAN.",
    reference: "1 Cor 11:9"
  },
  {
    text: "IT IS FOR THIS REASON THAT A WOMAN OUGHT TO HAVE AUTHORITY OVER HER OWN HEAD, BECAUSE OF THE ANGELS.",
    reference: "1 Cor 11:10"
  },
  {
    text: "NEVERTHELESS, IN THE LORD WOMAN IS NOT INDEPENDENT OF MAN, NOR IS MAN INDEPENDENT OF WOMAN.",
    reference: "1 Cor 11:11"
  },
  {
    text: "FOR AS WOMAN CAME FROM MAN, SO ALSO MAN IS BORN OF WOMAN. BUT EVERYTHING COMES FROM GOD.",
    reference: "1 Cor 11:12"
  },
  {
    text: "JUDGE FOR YOURSELVES: IS IT PROPER FOR A WOMAN TO PRAY TO GOD WITH HER HEAD UNCOVERED?",
    reference: "1 Cor 11:13"
  },
  {
    text: "DOES NOT THE VERY NATURE OF THINGS TEACH YOU THAT IF A MAN HAS LONG HAIR, IT IS A DISGRACE TO HIM,",
    reference: "1 Cor 11:14"
  },
  {
    text: "BUT THAT IF A WOMAN HAS LONG HAIR, IT IS HER GLORY?",
    reference: "1 Cor 11:15a"
  },
  {
    text: "FOR LONG HAIR IS GIVEN TO HER AS A COVERING.",
    reference: "1 Cor 11:15b"
  },
  {
    text: "IF ANYONE WANTS TO BE CONTENTIOUS ABOUT THIS, WE HAVE NO OTHER PRACTICE—NOR DO THE CHURCHES OF GOD.",
    reference: "1 Cor 11:16"
  },
  {
    text: "IN THE FOLLOWING DIRECTIVES I HAVE NO PRAISE FOR YOU,",
    reference: "1 Cor 11:17a"
  },
  {
    text: "FOR YOUR MEETINGS DO MORE HARM THAN GOOD.",
    reference: "1 Cor 11:17b"
  },
  {
    text: "IN THE FIRST PLACE, I HEAR THAT WHEN YOU COME TOGETHER AS A CHURCH, THERE ARE DIVISIONS AMONG YOU, AND TO SOME EXTENT I BELIEVE IT.",
    reference: "1 Cor 11:18"
  },
  {
    text: "NO DOUBT THERE HAVE TO BE DIFFERENCES AMONG YOU TO SHOW WHICH OF YOU HAVE GOD'S APPROVAL.",
    reference: "1 Cor 11:19"
  },
  {
    text: "SO THEN, WHEN YOU COME TOGETHER, IT IS NOT THE LORD'S SUPPER YOU EAT,",
    reference: "1 Cor 11:20"
  },
  {
    text: "FOR WHEN YOU ARE EATING, SOME OF YOU GO AHEAD WITH YOUR OWN PRIVATE SUPPERS.",
    reference: "1 Cor 11:21a"
  },
  {
    text: "AS A RESULT, ONE PERSON REMAINS HUNGRY AND ANOTHER GETS DRUNK.",
    reference: "1 Cor 11:21b"
  },
  {
    text: "DON'T YOU HAVE HOMES TO EAT AND DRINK IN?",
    reference: "1 Cor 11:22a"
  },
  {
    text: "OR DO YOU DESPISE THE CHURCH OF GOD BY HUMILIATING THOSE WHO HAVE NOTHING? WHAT SHALL I SAY TO YOU? SHALL I PRAISE YOU? CERTAINLY NOT IN THIS MATTER!",
    reference: "1 Cor 11:22b"
  },
  {
    text: "FOR I RECEIVED FROM THE LORD WHAT I ALSO PASSED ON TO YOU: THE LORD JESUS, ON THE NIGHT HE WAS BETRAYED, TOOK BREAD,",
    reference: "1 Cor 11:23"
  },
  {
    text: "AND WHEN HE HAD GIVEN THANKS, HE BROKE IT AND SAID, 'THIS IS MY BODY, WHICH IS FOR YOU; DO THIS IN REMEMBRANCE OF ME.'",
    reference: "1 Cor 11:24"
  },
  {
    text: "IN THE SAME WAY, AFTER SUPPER HE TOOK THE CUP, SAYING, 'THIS CUP IS THE NEW COVENANT IN MY BLOOD;",
    reference: "1 Cor 11:25a"
  },
  {
    text: "DO THIS, WHENEVER YOU DRINK IT, IN REMEMBRANCE OF ME.'",
    reference: "1 Cor 11:25b"
  },
  {
    text: "FOR WHENEVER YOU EAT THIS BREAD AND DRINK THIS CUP, YOU PROCLAIM THE LORD'S DEATH UNTIL HE COMES.",
    reference: "1 Cor 11:26"
  },
  {
    text: "SO THEN, WHOEVER EATS THE BREAD OR DRINKS THE CUP OF THE LORD IN AN UNWORTHY MANNER WILL BE GUILTY OF SINNING AGAINST THE BODY AND BLOOD OF THE LORD.",
    reference: "1 Cor 11:27"
  },
  {
    text: "EVERYONE OUGHT TO EXAMINE THEMSELVES BEFORE THEY EAT OF THE BREAD AND DRINK FROM THE CUP.",
    reference: "1 Cor 11:28"
  },
  {
    text: "FOR THOSE WHO EAT AND DRINK WITHOUT DISCERNING THE BODY OF CHRIST EAT AND DRINK JUDGMENT ON THEMSELVES.",
    reference: "1 Cor 11:29"
  },
  {
    text: "THAT IS WHY MANY AMONG YOU ARE WEAK AND SICK, AND A NUMBER OF YOU HAVE FALLEN ASLEEP.",
    reference: "1 Cor 11:30"
  },
  {
    text: "BUT IF WE WERE MORE DISCERNING WITH REGARD TO OURSELVES, WE WOULD NOT COME UNDER SUCH JUDGMENT.",
    reference: "1 Cor 11:31"
  },
  {
    text: "NEVERTHELESS, WHEN WE ARE JUDGED IN THIS WAY BY THE LORD, WE ARE BEING DISCIPLINED SO THAT WE WILL NOT BE FINALLY CONDEMNED WITH THE WORLD.",
    reference: "1 Cor 11:32"
  },
  {
    text: "SO THEN, MY BROTHERS AND SISTERS, WHEN YOU GATHER TO EAT, YOU SHOULD ALL EAT TOGETHER.",
    reference: "1 Cor 11:33"
  },
  {
    text: "ANYONE WHO IS HUNGRY SHOULD EAT SOMETHING AT HOME, SO THAT WHEN YOU MEET TOGETHER IT MAY NOT RESULT IN JUDGMENT.",
    reference: "1 Cor 11:34a"
  },
  {
    text: "AND WHEN I COME I WILL GIVE FURTHER DIRECTIONS.",
    reference: "1 Cor 11:34b"
  },
  {
    text: "GOD GRANT ME THE SERENITY TO ACCEPT THE THINGS I CANNOT CHANGE; COURAGE TO CHANGE THE THINGS I CAN; AND WISDOM TO KNOW THE DIFFERENCE.",
    reference: "Serenity Prayer 1"
  },
  {
    text: "LIVING ONE DAY AT A TIME; ENJOYING ONE MOMENT AT A TIME; ACCEPTING HARDSHIPS AS THE PATHWAY TO PEACE; TAKING, AS HE DID, THIS SINFUL WORLD AS IT IS, NOT AS I WOULD HAVE IT; TRUSTING THAT HE WILL MAKE ALL THINGS RIGHT IF I SURRENDER TO HIS WILL;",
    reference: "Serenity Prayer 2"
  },
  {
    text: "THAT I MAY BE REASONABLY HAPPY IN THIS LIFE AND SUPREMELY HAPPY WITH HIM FOREVER IN THE NEXT. AMEN.",
    reference: "Serenity Prayer 3"
  },
  {
    text: "I ARISE TODAY THROUGH A MIGHTY STRENGTH, THE INVOCATION OF THE TRINITY, THROUGH BELIEF IN THE THREENESS, THROUGH CONFESSION OF THE ONENESS OF THE CREATOR OF CREATION.",
    reference: "St. Pat. Breastplate 1"
  },
  {
    text: "I ARISE TODAY THROUGH THE STRENGTH OF CHRIST'S BIRTH WITH HIS BAPTISM, THROUGH THE STRENGTH OF HIS CRUCIFIXION WITH HIS BURIAL, THROUGH THE STRENGTH OF HIS RESURRECTION WITH HIS ASCENSION, THROUGH THE STRENGTH OF HIS DESCENT FOR THE JUDGMENT OF DOOM.",
    reference: "St. Pat. Breastplate 2"
  },
  {
    text: "I ARISE TODAY THROUGH THE STRENGTH OF THE LOVE OF CHERUBIM, IN THE OBEDIENCE OF ANGELS, IN THE SERVICE OF ARCHANGELS, IN THE HOPE OF RESURRECTION TO MEET WITH REWARD, IN THE PRAYERS OF PATRIARCHS, IN THE PREDICTIONS OF PROPHETS, IN THE PREACHING OF APOSTLES, IN THE FAITH OF CONFESSORS, IN THE INNOCENCE OF HOLY VIRGINS, IN THE DEEDS OF RIGHTEOUS MEN.",
    reference: "St. Pat. Breastplate 3"
  },
  {
    text: "I ARISE TODAY, THROUGH THE STRENGTH OF HEAVEN, THE LIGHT OF THE SUN, THE RADIANCE OF THE MOON, THE SPLENDOR OF FIRE, THE SPEED OF LIGHTNING, THE SWIFTNESS OF WIND, THE DEPTH OF THE SEA, THE STABILITY OF THE EARTH, THE FIRMNESS OF ROCK.",
    reference: "St. Pat. Breastplate 4"
  },
  {
    text: "I ARISE TODAY, THROUGH GOD'S STRENGTH TO PILOT ME, GOD'S MIGHT TO UPHOLD ME, GOD'S WISDOM TO GUIDE ME, GOD'S EYE TO LOOK BEFORE ME, GOD'S EAR TO HEAR ME, GOD'S WORD TO SPEAK FOR ME, GOD'S HAND TO GUARD ME, GOD'S SHIELD TO PROTECT ME, GOD'S HOST TO SAVE ME FROM SNARES OF DEVILS, FROM TEMPTATION OF VICES, FROM EVERYONE WHO SHALL WISH ME ILL, AFAR AND NEAR.",
    reference: "St. Pat. Breastplate 5"
  },
  {
    text: "I SUMMON TODAY ALL THESE POWERS BETWEEN ME AND THOSE EVILS, AGAINST EVERY CRUEL AND MERCILESS POWER THAT MAY OPPOSE MY BODY AND SOUL, AGAINST INCANTATIONS OF FALSE PROPHETS, AGAINST BLACK LAWS OF PAGANDOM, AGAINST FALSE LAWS OF HERETICS, AGAINST CRAFT OF IDOLATRY, AGAINST SPELLS OF WITCHES AND SMITHS AND WIZARDS, AGAINST EVERY KNOWLEDGE THAT CORRUPTS MAN'S BODY AND SOUL; CHRIST TO SHIELD ME TODAY AGAINST POISON, AGAINST BURNING, AGAINST DROWNING, AGAINST WOUNDING, SO THAT THERE MAY COME TO ME AN ABUNDANCE OF REWARD.",
    reference: "St. Pat. Breastplate 6"
  },
  {
    text: "CHRIST WITH ME, CHRIST BEFORE ME, CHRIST BEHIND ME, CHRIST IN ME, CHRIST BENEATH ME, CHRIST ABOVE ME, CHRIST ON MY RIGHT, CHRIST ON MY LEFT, CHRIST WHEN I LIE DOWN, CHRIST WHEN I SIT DOWN, CHRIST WHEN I ARISE, CHRIST IN THE HEART OF EVERY MAN WHO THINKS OF ME, CHRIST IN THE MOUTH OF EVERYONE WHO SPEAKS OF ME, CHRIST IN EVERY EYE THAT SEES ME, CHRIST IN EVERY EAR THAT HEARS ME.",
    reference: "St. Pat. Breastplate 7"
  },
  {
    text: "LORD, MAKE ME AN INSTRUMENT OF YOUR PEACE. WHERE THERE IS HATRED, LET ME BRING LOVE. WHERE THERE IS OFFENCE, LET ME BRING PARDON. WHERE THERE IS DISCORD, LET ME BRING UNION. WHERE THERE IS ERROR, LET ME BRING TRUTH. WHERE THERE IS DOUBT, LET ME BRING FAITH. WHERE THERE IS DESPAIR, LET ME BRING HOPE. WHERE THERE IS DARKNESS, LET ME BRING YOUR LIGHT. WHERE THERE IS SADNESS, LET ME BRING JOY.",
    reference: "Prayer of St. Francis 1"
  },
  {
    text: "O LORD, GRANT THAT I MAY NOT SO MUCH SEEK TO BE CONSOLED AS TO CONSOLE, TO BE UNDERSTOOD AS TO UNDERSTAND, TO BE LOVED AS TO LOVE, FOR IT IS IN GIVING THAT ONE RECEIVES, IT IS IN SELF-FORGETTING THAT ONE FINDS, IT IS IN FORGIVING THAT ONE IS FORGIVEN, IT IS IN DYING THAT ONE AWAKENS TO ETERNAL LIFE.",
    reference: "Prayer of St. Francis 2"
  },
  {
    text: "ALMIGHTY AND MOST MERCIFUL FATHER, WE HAVE ERRED AND STRAYED FROM THY WAYS LIKE LOST SHEEP,",
    reference: "Confession Prayer 1"
  },
  {
    text: "WE HAVE FOLLOWED TOO MUCH THE DEVICES AND DESIRES OF OUR OWN HEARTS, WE HAVE OFFENDED AGAINST THY HOLY LAWS,",
    reference: "Confession Prayer 2"
  },
  {
    text: "WE HAVE LEFT UNDONE THOSE THINGS WHICH WE OUGHT TO HAVE DONE, AND WE HAVE DONE THOSE THINGS WHICH WE OUGHT NOT TO HAVE DONE,",
    reference: "Confession Prayer 3"
  },
  {
    text: "AND THERE IS NO HEALTH IN US. BUT THOU, O LORD, HAVE MERCY UPON US MISERABLE OFFENDERS;",
    reference: "Confession Prayer 4"
  },
  {
    text: "SPARE THOU THEM, O GOD, WHICH CONFESS THEIR FAULTS. RESTORE THOU THEM THAT ARE PENITENT,",
    reference: "Confession Prayer 5"
  },
  {
    text: "ACCORDING TO THY PROMISES DECLARED UNTO MANKIND IN CHRIST JESU OUR LORD. AND GRANT, O MOST MERCIFUL FATHER, FOR HIS SAKE,",
    reference: "Confession Prayer 6"
  },
  {
    text: "THAT WE MAY HEREAFTER LIVE A GODLY, RIGHTEOUS, AND SOBER LIFE, TO THE GLORY OF THY HOLY NAME. AMEN.",
    reference: "Confession Prayer 7"
  }
];

// Helper function to organize verses by chapter
export const organizeVersesByChapter = (): ChapterGroup[] => {
  const chapters = new Map<string, BibleVerse[]>();
  
  BIBLE_VERSES.forEach(verse => {
    let chapterRef: string;
    
    // Handle Bible verses with colon format (e.g., "1 Cor 10:14" -> "1 Cor 10")
    const bibleChapterMatch = verse.reference.match(/^(.*?\d+):/);
    if (bibleChapterMatch) {
      chapterRef = bibleChapterMatch[1];
    } 
    // Handle Serenity Prayer verses (e.g., "Serenity Prayer 1" -> "Serenity Prayer")
    else if (verse.reference.startsWith('Serenity Prayer')) {
      chapterRef = 'Serenity Prayer';
    }
    // Handle St. Patrick's Breastplate verses (e.g., "St. Pat. Breastplate 1" -> "St. Pat. Breastplate")
    else if (verse.reference.startsWith('St. Pat. Breastplate')) {
      chapterRef = 'St. Pat. Breastplate';
    }
    // Handle Prayer of St. Francis verses (e.g., "Prayer of St. Francis 1" -> "Prayer of St. Francis")
    else if (verse.reference.startsWith('Prayer of St. Francis')) {
      chapterRef = 'Prayer of St. Francis';
    }
    // Handle Confession Prayer verses (e.g., "Confession Prayer 1" -> "Confession Prayer")
    else if (verse.reference.startsWith('Confession Prayer')) {
      chapterRef = 'Confession Prayer';
    }
    // Handle any other special cases by using the full reference
    else {
      chapterRef = verse.reference;
    }
    
    if (!chapters.has(chapterRef)) {
      chapters.set(chapterRef, []);
    }
    chapters.get(chapterRef)!.push(verse);
  });
  
  // Convert map to array in original order
  return Array.from(chapters.entries())
    .map(([chapterRef, verses]) => ({
      chapterTitle: chapterRef,
      chapterReference: chapterRef,
      verses: verses // Keep verses in original order
    }));
};

// Export organized chapters
export const BIBLE_CHAPTERS = organizeVersesByChapter(); 