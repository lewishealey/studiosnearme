# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: papa.xnoc.net (MySQL 5.6.23)
# Database: studiosn_me
# Generation Time: 2015-04-12 20:13:52 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table studios
# ------------------------------------------------------------

DROP TABLE IF EXISTS `studios`;

CREATE TABLE `studios` (
  `ListID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `StudioName` varchar(150) DEFAULT NULL,
  `StudioFullAddress` varchar(150) DEFAULT NULL,
  `StudioCategory` varchar(150) DEFAULT NULL,
  `StudioLat` varchar(150) DEFAULT NULL,
  `StudioLong` varchar(150) DEFAULT NULL,
  `StudioTwitter` varchar(200) DEFAULT NULL,
  `StudioWebsite` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`ListID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOCK TABLES `studios` WRITE;
/*!40000 ALTER TABLE `studios` DISABLE KEYS */;

INSERT INTO `studios` (`ListID`, `UserID`, `StudioName`, `StudioFullAddress`, `StudioCategory`, `StudioLat`, `StudioLong`, `StudioTwitter`, `StudioWebsite`)
VALUES
	(2,0,'Publicasity','15 Kean Street, Covent Garden, London, WC2B 4AZ','Advertising','51.513868','-0.119013','publicasity','http://www.publicasity.co.uk/'),
	(9,0,'Digit','6 Brewhouse Yard London EC1V 4DG','Communications','51.524338','-0.102422','digitlondon','http://www.digitlondon.com/'),
	(10,0,'POKE','Biscuit Building 10 Redchurch Street London E2 7DD ','Advertising,Digital','51.524448','-0.074646','pokelondon','http://www.pokelondon.com/'),
	(11,0,'Mother','Biscuit Building 10 Redchurch Street London E2 7DD ','Advertising','51.524127','-0.076223','motherlondon','http://www.motherlondon.com/'),
	(12,0,'Albion','1.03 Tea Building 56 Shoreditch High Street London E1 6JJ ','Advertising','51.524127','-0.076223','albionco','http://albion.co/'),
	(13,0,'Balloon Dog','36 Percy Street, London, W1T 2DH','Advertising','51.518282','-0.134124','balloon_dog','http://www.balloondog.co.uk/'),
	(14,0,'Crab Creative','176 Shoreditch High Street E1 6AX','Advertising','51.524492','-0.07765','crabcreative','http://www.crabcreative.com/'),
	(15,0,'Creature of London','21 Curtain Road, London, EC2A 3LU','Advertising','51.522685','-0.080969','creature_stu','http://www.creaturelondon.com/'),
	(21,0,'The Viral Factory','3 Gillett Square, N16 3JH','Advertising','51.549059','-0.076531','viralfactory','http://www.theviralfactory.com/'),
	(23,0,'Glue Isobar','10 Triton Street London, NW1 3BF','Advertising','51.530373','-0.077419','glueisobar','http://www.isobar.com/'),
	(24,0,'Higher Ground Creative','Fish Island Labs, 60 Dace Road, London, E3 2NQ','Advertising','51.537583','-0.02337','higher_ground','http://www.highergroundcreative.co.uk/'),
	(25,0,'Rehab Studio','77 East Road, London, N1 6AH','Production','51.529076','-0.087511','rehabstudio','https://rehabstudio.com/'),
	(26,0,'Analog Folk','1-3 Bath Court, Warner Street, London, EC1R 4SX','Marketing','51.523398','-0.111163','AnalogFolk','http://analogfolk.com/'),
	(27,0,'Fold 7','16-18 Kirkby Street, Farringdon, London, EC1N 8TS','Advertising','51.519981','-0.10734','Fold7','http://fold7.com/'),
	(28,0,'Untitled','St. Marks House, Shepherdess Walk, N17LH','Advertising','51.530024','-0.092613','untitledlondon','http://www.untitledlondon.com/'),
	(29,0,'Mars London','230 City Road, London, EC1V 2TT','Marketing','51.528478','-0.093009','wearemarslondon','http://www.marslondon.co.uk/'),
	(30,0,'Made by Many','Diespeker Wharf 38 Graham Street London N1 8JX','Advertising','51.532365','-0.099363','madebymany','http://madebymany.com/'),
	(31,0,'Atomic London','91-94 Saffron Hill London EC1N 8QP UK','Advertising','51.521099','-0.107514','atomic_london','http://atomic-london.co.uk/'),
	(33,0,'London Advertising','LONDON House 3 Baltic Street East London EC1Y 0UJ','Advertising','51.523555','-0.096229','LONDONAdAgency','http://www.londonadvertising.com/'),
	(34,0,'Tag Worldwide','29 Clerkenwell Road London EC1M 5TA','Marketing','51.522481','-0.102686','TAGWorldwideInc','http://www.tagworldwide.com/'),
	(35,0,'Tag (Soho Office)','1 - 5 Poland Street  London  W1F 8PR','Marketing','51.514057','-0.136459','TAGWorldwideInc','http://www.tagworldwide.com/'),
	(36,0,'Tag (Barbican)','68 St John Street London  EC1M 4AS','Marketing','51.52152','-0.101495','TAGWorldwideInc','http://www.tagworldwide.com/'),
	(37,0,'Tag (Bakers Yard)','3 - 4 Bakers Yard London,  EC1R 3DD','Marketing','51.523573','-0.110203','TAGWorldwideInc','http://www.tagworldwide.com/'),
	(38,0,'R/GA London','151 Rosebery Ave London EC1R 4AB','Advertising','51.527225','-0.108098','RGA','http://www.rga.com/'),
	(39,0,'We Are Social','1 St John\'s Square\nLondon EC1M 4PN','Digital','51.522324','-0.103173','wearesocial','http://wearesocial.net/'),
	(40,0,'Havas EHS','6 Briset Street London EC1M 5NR','Advertising','51.521528','-0.10336200000006102','havasehs','http://www.havasehs.com'),
	(41,0,'Kitcatt Nohr','91 Brick Lane, London, United Kingdom, E1 6QL','CRM','51.52115','-0.071858','kitcattnohr','http://kitcattnohr.com/'),
	(42,0,'AKQA','1 St Johnâ€™s Lane London, EC1M 4BL','Advertising','51.520652','-0.10246','AKQA','http://www.akqa.com/'),
	(43,0,'Aqueduct','10 Lindsey Street London EC1A 9HP','Digital','51.519559','-0.100488','weareaqueduct','http://www.aqueduct.co.uk/'),
	(44,0,'Karmarama','20 Farringdon Road, London, EC1M 3HE','Advertising','51.519863','-0.105613','karmarama','http://www.karmarama.com/'),
	(45,0,'Biff New Media','24 Greville Street London EC1N 8SS','Design, Advertising','51.51956','-0.106373','balloon_dog','http://www.balloondog.co.uk'),
	(46,0,'Possible London','77 Hatton Garden, London, LDN, GB EC1N 8JS','Advertising','51.520135','-0.108533','possible','http://www.possible.com/'),
	(47,0,'FCB Inferno','31 Great Queen Street. Covent Garden. London, WC2B 5AE','Digital','51.515385','-0.121536','fcbinferno','http://www.fcbinferno.com/'),
	(48,0,'Blue State Digital','68-80 Hanbury Street, London, E1 5JL','Advertising, Digital','51.520184','-0.071013','BSD','https://www.bluestatedigital.com/'),
	(49,0,'Krow Communications','80 Goswell Road, London, EC1V 7DB','Advertising','51.523774','-0.098683','hellokrow','http://www.krowcommunications.com/'),
	(50,0,'Amp London','3-7 Herbal Hill, London EC1R 5EJ','Advertising','51.522653','-0.10849','amplondon','http://www.amp-london.com/'),
	(51,1,'Brothers & Sisters','31a Clerkenwell Close London EC1R 0AT','Advertising','51.524337','-0.106529','broandsis','http://www.brothersandsisters.co.uk/'),
	(52,0,'Hello World','535 Plaza Kings Road, London, SW10 0SZ','Digital','51.48002','-0.185789','helloworld_','http://www.helloworldlondon.co.uk'),
	(53,0,'Mint Digital','Exmouth House 3-11 Pine Street London, EC1R 0JH','Digital','51.525191','-0.109609','mintdigital','http://mintdigital.com/'),
	(54,0,'Enter Here','10 Great Pulteney Street,  London, W1F 9NB','Advertising','51.512268','-0.136087','WeAreENTER','http://www.enter-here.co.uk/'),
	(55,0,'Collective London','72-82 Rosebery Ave, London, EC1R 4RW','Advertising, Digital','51.526515','-0.108821','collectiveldn','http://www.collectivelondon.com/'),
	(56,0,'McCann London','7 Herbrand St London WC1N 1EX','Advertising','51.523703','-0.125633','mccannlondon','http://mccannlondon.co.uk/'),
	(57,0,'St Lukes Communications','18 Dukes Rd Kings Cross, London WC1H 9PY','Advertising','51.527148','-0.129118',NULL,'http://www.stlukes.co.uk/'),
	(58,0,'The Corner Shop','36 Great Queen Street, London, WC2B 5AA','PR','51.515177','-0.121776','tcspr','http://thecornershoppr.com/'),
	(59,0,'Pollen London','601 International House 223 Regent Street London W1B 1QD','Digital, Branding','51.513629','-0.141595','pollenlondon','http://pollenlondon.com/'),
	(61,0,'LBi','146 Brick Lane London E1 6RU UK','Advertising','51.521734','-0.07177','digitaslbi_uk','http://www.digitaslbi.com/'),
	(62,0,'Unruly','42-46 Princelet St, London E1 5LP','Marketing, Film Production','51.519647','-0.070661','unrulyco','http://unruly.co/'),
	(64,0,'usTwo','62 Shoreditch High Street London E1 6JJ','Digital, Web','51.52412','-0.077224','ustwo','http://ustwo.com/'),
	(66,0,'Method','The Tea Building, Studio 7.01 56 Shoreditch High Street London, E1 6JJ ','Advertising, Digital','51.524127','-0.076223','method_inc','http://method.com/'),
	(67,0,'Unit9','2-4 Hoxton Square London N1 6NU United Kingdom','Film Production, Web, Digital','51.527453','-0.081695','unit9','http://www.unit9.com/'),
	(68,0,'AllofUs','7-11 Herbrand Street, London WC1N 1EX','Interaction Design, Digital','51.523554','-0.125808','allofustweet','http://allofus.com/'),
	(69,0,'Moving Brands','7â€“8 Charlotte Road London EC2A 3DH','Agency, Creative','51.526341','-0.081252','movingbrands','http://www.movingbrands.com/'),
	(72,0,'Brilliant Path',NULL,'Communications - Brand','51.512482','-0.130527','brilliantpath','http://www.brilliantpath.com'),
	(73,0,'Dare','101 New Cavendish Street\nLondon W1W 6XH','Advertising','51.516942','-0.139968','ThisIsDare','http://www.thisisdare.com'),
	(76,0,'Elvis Communications','3rd floor, 101 New Cavendish Street, London W1W 6XH','Marketing','51.51828','-0.131746','elviscomms','http://www.elviscommunications.com'),
	(78,0,'Harvest Digital','71 Newman Street \nLondon \nW1T 3EQ','Marketing, Digital','51.514992','-0.134668','harvestdigital','http://www.harvestdigital.com'),
	(81,0,'Inferno','31 Great Queen Street, London, WC2B 5AE','Advertising','51.515286','-0.12145','infernoagency','http://www.inferno-group.com'),
	(84,0,'MBA','St Martin\'s Courtyard\n11 Slingsby Place\nLondon\nWC2E 9AB','Advertising','51.512438347331006','-0.1266002655029297','MBABrandAction','http://www.mba.co.uk'),
	(98,0,'Marketing Options International','WATERLOO HOUSE, 40 Baker Street, Weybridge, KT13 8AR','Marketing','51.389967','-0.42101000000002387','MOInternational','http://www.mointernational.com'),
	(102,0,'Holler','Warwick Building, Kensington Village, Avonmore Road, London W14 8HQ','Digital, Advertising','51.49446','-0.206248','hollerlondon','http://holler.co.uk/'),
	(114,1,'Foxtrot Hotel','601 International House 223 Regent Street London W1B 1QD','Communication','51.513629','-0.141595','foxtrothoteluk','http://www.foxtrothotel.co.uk'),
	(126,0,'TBG London',NULL,'Digital','51.553944','-0.14475400000003447','tbgdigital','http://www.tbglondon.com'),
	(133,1,'OgilvyOne London - East','15 Cabot Square, London E14 4QS','Advertising','51.505595','-0.022399','OgilvyUK','http://www.ogilvy.co.uk'),
	(137,1,'OgilvyOne London - West','3 Cleveland Terrace, London W2 6LH','Advertising','51.517009','-0.180356','OgilvyUK','http://www.ogilvy.co.uk'),
	(139,1,'London Advertising','LONDON House 3 Baltic Street East London EC1Y 0UJ','Advertising','51.523555','-0.096229','LONDONAdAgency','http://www.londonadvertising.com/'),
	(140,1,'Grey London','Johnson Building, 77 Hatton Garden, London EC1N 8JS','Advertising','51.520142','-0.10878','greylondon','http://www.grey.co.uk'),
	(141,1,'BBH','60 Kingly Street, London, W1B 5DS','Advertising','51.512712','-0.139516','bbhlondon','http://www.bartleboglehegarty.com'),
	(142,1,'The Corner London','1 Richmond Mews, London, W1D 3DA','Advertising','51.513854','-0.133325','thecornerLDN','http://www.thecornerlondon.com/'),
	(143,1,'Iris','185 Park Street, London, SE1 9DY','Advertising','51.506926','-0.096775','irisworldwide','http://www.iris-worldwide.com/'),
	(144,1,'Amvbbdo','151 Marylebone Road, London, NW1 5QE','Advertising','51.521554','-0.161116','AMV_BBDO','http://amvbbdo.com/'),
	(146,1,'RKCR/Y&R','Greater London House, Hampstead Road, London NW1 7QP','Advertising','51.533441','-0.139618','rkcr_yr','http://www.rkcryr.com/'),
	(147,1,'Wunderman','Greater London House, Hampstead Road, London NW1 7QP','Advertising, Digital','51.533441','-0.139618','wunderman','http://wunderman.com/'),
	(148,1,'Blue Hive','10 Cabot Square, Canary Wharf, London E14 4QB','Advertising','51.505931','-0.022312','thebluehive','http://www.thebluehive.com/'),
	(150,1,'Leo Burnett','Kensington Village, Warwick Building, Avonmore Road, London, W14 8HQ','Advertising','51.49446','-0.206248','LeoBurnett','http://www.leoburnett.com'),
	(151,1,'RAPP','1 Riverside, Manbre Road, London, W6 9WA','Advertising','51.486456','-0.224928','rapp_uk','http://www.uk.rapp.com/'),
	(152,1,'Saatchi & Saatchi','Saatchi & Saatchi, 80 Charlotte Street, London, W1A 1AQ','Advertising','51.517133','-0.134244','SaatchiLondon','http://www.saatchi.co.uk'),
	(153,1,'Citypress','6.03 The Gridiron Building, One Pancras Square, London N1C 4AG','Marketing, PR','51.533766','-0.12657','citypress','http://www.citypress.co.uk'),
	(158,1,'Jam','60 Great Portland Street, London, W1W 7RT','Advertising','51.517796','-0.141419','spreadingjam','http://www.spreadingjam.com'),
	(159,1,'WCRS','60 Great Portland Street, London, W1W 7RT','Marketing, Advertising','51.517796','-0.141419','WCRS_LDN','http://www.wcrs.com/'),
	(160,1,'The Minimart','14-15 Dâ€™Arblay Street, London, W1F 8DZ','Advertising','51.514598','-0.136567','TheMinimart','http://www.theminimart.com/'),
	(161,1,'Start JudgeGill','Unit 4.01, Tea Building, 56 Shoreditch High St, London E1 6JJ','Advertising','51.524127','-0.076223','StartJudgeGill','http://www.startjg.com/'),
	(162,1,'twentysix','183 Eversholt Street, London, NW1 1BU','Marketing','51.531926','-0.1358','26Digital','http://www.twentysixdigital.com/'),
	(163,1,'Guerilla Communications','18 Soho Square, London, W1D 3QL','Advertising','51.51595','-0.131698','we_are_guerilla','http://www.guerilla.co.uk/'),
	(181,0,'YOU','77 St. Martin\'s Lane, London, WC2N 4AA','Advertising','51.511495','-0.127493','YouAgency','http://www.you-agency.com'),
	(182,0,'Hatched','Studio 200 , Great Western Studios, 65 Alfred Road, London W2 5EU','Advertising','51.50379','-0.100604','hatchedlondon','http://www.hatchedlondon.com'),
	(183,0,'Grafton Media','18 Soho Square, London, W1D 3Q','Advertising','51.515796','-0.131808','GraftonMedia','http://www.graftonmedia.com'),
	(185,0,'McGarry Bowen','10 Hills Place, London, W1F 7SD','Advertising','51.515221','-0.140263','mcgarrybowen','http://www.mcgarrybowen.com'),
	(186,0,'Tullo Marshall Warren','Creston House, 10 Great Pulteney Street, London, W1F 9NB','Advertising','51.488956','-0.164246','tmwagency','http://www.tmwunlimited.com/'),
	(190,0,'The Red Brick Road','50-54 Beak St, London W1F 9RN','Advertising','51.512759','-0.136296','TheRedBrickRd','http://www.theredbrickroad.com/'),
	(192,0,'Stack','90 Tottenham Court Road, London W1T 4TJ','Advertising','51.52208373','-0.135916915','stackagency','http://www.stackworks.com/'),
	(195,0,'The Good Agency','8 Boundary Row, London, SE1 8HP','Advertising','51.502061','-0.105878','thegoodagency','http://www.goodagency.co.uk/'),
	(200,0,'Brave London','7 Heathmans Road, London, SW6 4TJ','Advertising','51.5214785','-0.1217064','BraveCreativity','http://www.brave.co.uk/'),
	(201,0,'Leagas Delaney','1 Alfred Place, London, WC1E 7EB','Advertising','51.519685','-0.132537','LeagasDelaney','http://www.leagasdelaney.co.uk/'),
	(202,0,'Babygrand London','55 Greek Street, Soho, London W1D 3DT','Marketing','51.514379','-0.131181','babygrandlondon','http://babygrandmarketing.com/'),
	(206,0,'Delaney Lund Knox Warren','60 Sloane Avenue, London, SW3 3XB','Advertising','51.49285','-0.166957','DLKWLowe','http://www.dlkwlowe.com/'),
	(207,0,'Publicis','82 Baker Street, London, W1U 6AE','Advertising','51.51625','-0.134146','publicislondon','http://publicis.london/'),
	(208,0,'Beattie McGuinness Bungay','16 Shorts Gardens, Covent Garden, London, WC2H 9AU','Advertising','51.514169','-0.126164','bmbagency','http://www.bmbagency.com/'),
	(209,0,'Adam+Eve DDB','12, Bishops Bridge Road, London, W2 6AA','Advertising','51.517949','-0.180791','aandeddb','http://www.adamandeveddb.com/'),
	(211,0,'AIS','247 Tottenham Court Road, London, W1T 7QX','Digital','51.517924','-0.137319','aislondon','http://www.aislondon.com/'),
	(216,0,'Nonsense','Augustine Hall, 6 Yorkton Street, London, E2 8NH','Digital','51.511695','-0.133922','nonsenselondon','http://nonsenselondon.com/'),
	(217,0,'Agency Republic','2nd floor, 35 Great Sutton Street, London EC1V 0DX','Video, Digital','51.480093','-0.171339','RepPub','http://www.republicpublishing.co.uk/'),
	(218,0,'Tribal DDB','12 Bishop\'s Bridge Road, London UK W2 6AA','Digital','51.517966','-0.180732','TribalLDN','http://www.tribalworldwide.co.uk/'),
	(219,0,'Lean Mean Fighting Machine','2nd Floor, 17 Ferdinand Street, London, NW1 8EU','Digital','51.543861','-0.149314','fightingmachine','https://www.leanmeanfightingmachine.co.uk/'),
	(221,0,'The Cake Group','87-91 Newman Street, London, W1T 3EY','Digital, Advertising','51.517928','-0.132587','cakegroup','http://www.cakegroup.com/'),
	(222,0,'BD Network','Tea Building, 56 Shoreditch High Street London E1 6PQ','Digital','51.524127','-0.076224','thisisbd','http://thisisbd.com/'),
	(227,0,'Beta','Circus House , 2nd Floor, 21 Great Titchfield Street, London, W1W 8BA','Digital','51.517281','-0.140198','beta_london','http://www.betalondon.com/'),
	(230,0,'LIDA','36 Golden Square, London, W1F 9EE','Marketing','51.511824','-0.137245','lidalondon','http://www.lida.com/'),
	(232,0,'Crispin Porter & Bogusky','The Brassworks, 32 York Way, London, N1 9AB','Advertising','51.532181','-0.122343','CPBKX','http://www.cpbgroup.com/'),
	(233,0,'Made by Many','Diespeker Wharf, 38 Graham Street, London, N1 8JX','Digital','51.531053','-0.09804','madebymany','http://madebymany.com/'),
	(234,0,'MARS London','230 City Road, London, EC1V 2TT','Marketing','51.528592','-0.09345','wearemarslondon','http://www.marslondon.co.uk/'),
	(235,0,'M&C Saatchi','36 Golden Square, Soho, London, W1F 9EE','Advertising','51.512098','-0.137692','MCSaatchiLondon','http://www.mcsaatchi.com/london/'),
	(242,0,'Ogilvy Advertising','15 Cabot Square, London E14 4QS, UK','Advertising','51.50558264','-0.021973135','OgilvyUK','http://ogilvy.co.uk/'),
	(245,0,'JWT','1 Knightsbridge Green, London, SW1X 7NW','Advertising','51.50105','-0.162261','JWT_London','http://jwt.co.uk/'),
	(246,1,'CHI & Partners','7-9 Rathbone Street, London, W1T 1LY','Advertising','51.517784','-0.134706','chiandpartners','http://www.chiandpartners.com/'),
	(252,0,'Profero','6th Floor, 66 Prescot Street, London, E1 8HG','Advertising','51.537153','-0.135612','loweprofero','http://www.loweprofero.com/'),
	(254,0,'TBWA \\ London','76-80 Whitfield Street, London, W1T 4EZ ','Advertising','51.522349','-0.137029','tbwalondon','http://tbwa-london.com/'),
	(255,0,'Pancentric Digital','4-8 Emerson Street, London, SE1 9DU','Digital','51.5068','-0.096388','pancentric','http://www.pancentric.com/'),
	(256,0,'BETC London','20 Rathbone Place, London, W1T 1HY','Advertising','51.517449','-0.133807','BETCLondon','http://www.betc.co.uk/'),
	(257,0,'Hey Human','40 Vanston Place, London, SW6 1AX','Advertising','51.480735','-0.197408','heyhumanagency','http://heyhuman.com/'),
	(259,0,'Geometry Global','121-141 Westbourne Terrace, W2 6JR, London','Digital','51.500989','-0.162935','geometryglobal','http://www.geometry.com/'),
	(260,0,'Goodstuff Communications','Seymour Mews House, 26-37 Seymour Mews, London, W1H 6BN','Social','51.518703','-0.166533','goodstuffers','http://goodstuff.co.uk/'),
	(261,0,'Gravity Road','31 Great Marlborough St, London W1F 7JA','Advertising','51.514011','-0.13947','gravity_road','http://gravityroad.com/'),
	(262,1,'Joint London','','','51.511258','-0.1363158','','http://www.jointlondon.com/'),
	(263,1,'Initiative','42 St John\'s Square, London, EC1M 4EA','Marketing','51.522372','-0.103233','InitiativeUK','http://initiative.co.uk/'),
	(265,1,'The Brooklyn Bros','11-19 Smith\'s Court, London, W1D 7DP','Advertising','51.511252','-0.135421','thebkbrothers','http://thebrooklynbrothers.com/'),
	(271,1,'HMDG','10 Great Pulteney Street, London, W1F 9NB','Advertising','51.525293','-0.109829','WeAreENTER','http://www.enter-here.co.uk/'),
	(272,1,'Mortimer Whittaker O\'Sullivan','The Carriage Hall, 29 Floral Street, London, WC2E 9TD','Advertising, Digital','51.512038','-0.125242','','http://www.mwo.co.uk/'),
	(276,1,'Kindred Agency','4th floor Dean Bradley House, 52 Horseferry Road, London, SW1P 2AF','PR','51.51407','-0.123152','KindredAgency','http://www.kindredagency.com/'),
	(280,1,'Accord - London','Castlewood,  85 New Oxford Street, London WC1A 1DG','Advertising, Digital','51.5164436','-0.1302193','AccordAdValue','http://www.accordgroup.co.uk/'),
	(283,1,'Souk 360','2nd Floor, Magdalen House, 148 Tooley Street, London, SE1 2TU','Digital, Marketing','51.503736','-0.081161','soukresponse','http://www.soukresponse.com/'),
	(287,1,'Big Al\'s Creative Emporium','53a Brewer Street, London, W1F 9UH','Advertising','51.51152','-0.135349','','http://www.bigalscreativeemporium.com/'),
	(292,1,'Masius','23 Howland Street, London, W1A 4XA','Advertising','51.521464','-0.13645','saatchimasius','http://saatchimasius.co.uk/'),
	(293,0,'Fox Kalomaski','48 Fitzroy Street, London, W1T 5BS','Advertising','51.523684','-0.140032','fkclondon','http://www.fkclondon.co.uk/'),
	(311,0,'SapientNitro','Eden House, 8 Spital Square, London, E1 6DU','Advertising','51.504255','-0.097418','sapientnitro','http://www.sapientnitro.com/en-us.html#home'),
	(312,0,'twotwentyseven','16 Lonsdale Road, London, NW6 6RD','Digital','51.522096','-0.201015','twotwentyseven','http://www.twotwentyseven.com/'),
	(313,0,'VCCP','Greencoat House, Francis Street, London, SW1P 1DH','Advertising','51.495653','-0.151148','VCCP','http://www.vccp.com/'),
	(315,0,'Work Club','70 Newcomen Street, London, SE1 1YT','Advertising','51.502866','-0.091174','workclub','http://work-club.com/'),
	(316,0,'W+K London','16 Hanbury St, London, E1 6QR','Advertising','51.520242','-0.073383','wiedenkennedy','http://wklondon.com/'),
	(333,0,'Kazoo PR','Fourth Floor, 93 Newman Street, London, W1T 3EZ','PR','51.515394','-0.139079','KazooPR','http://www.kazoo.co.uk/'),
	(365,0,'Razorfish','Elsley Court, 20-22 Great Titchfield Street, London, W1W 8BE','Advertising','51.521463','-0.13746','Razorfish','http://www.razorfish.com/'),
	(366,0,'This Is Now','4th Floor, National House, 60-66 Wardour Street, London, W1F 0TA','Advertising','51.518592','-0.139308','nowfeed','http://www.thisisnow.biz/'),
	(369,0,'Base One','8 Waldegrave Road, Teddington, TW11 8GT','Marketing','51.461708','-0.243759','Base_One','http://www.baseone.co.uk/'),
	(377,0,'The Team','30 Park Street, London, SE1 9EQ','Advertising','51.506297','-0.09274','theteam','http://theteam.co.uk/'),
	(378,0,'Holler','Warwick Building, Kensington Village, Avonmore Road, London, W14 8HQ','Advertising','51.492199','-0.203043','hollerlondon','http://holler.co.uk/'),
	(381,0,'Table 19','The Clove Building, 4 Maguire Street, London, SE1 2NQ','Digital','51.501543','-0.082034','wearetable19','http://www.table19.co.uk/'),
	(382,0,'Blue Rubicon','6th Floor, 6 More London Place, London, SE1 2DA','Advertising','51.504843','-0.083084','bluerubicon','http://www.bluerubicon.com/'),
	(383,0,'Cubo Group','Holden House, 57 Rathbone Place, London, W1T 1JU','Advertising','51.516374','-0.133439','CuboGroup','http://www.cubo.com/'),
	(384,1,'Not Studio','Unit 3, 1a Little Tichfield Street, Fitzvovia, London, W1W 7BX ','Digital','51.518013','-0.140968','','http://not-studio.com/');

/*!40000 ALTER TABLE `studios` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
