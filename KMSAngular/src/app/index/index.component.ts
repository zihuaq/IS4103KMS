import { Component, OnInit, ViewChild } from '@angular/core';
import { IndividualQuestionnaire } from '../classes/individualQuestionnaire';
import { OrganisationQuestionnaire } from '../classes/organisationQuestionnaire';
import { User } from '../classes/user';
import { Tag } from 'src/app/classes/tag';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';
import { SessionService } from '../session.service';
import { TagService } from 'src/app/tag.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {


  individualQuestinnaire: IndividualQuestionnaire = new IndividualQuestionnaire()
  organisationQuestionnaire: OrganisationQuestionnaire = new OrganisationQuestionnaire()
  currentUser: User
  allSDGTags: Tag[];
  selectedTags: Tag[] = [];
  questionNumber: number = 0;

  individualAwareOfSDG: string;
  individualPassionateSDGs = [];
  individualPassionateSDGsNumber: number[] = [];
  individualPassionateSDGsDoneNumber: number[] = [];
  individualPassionateSDGTargets = []
  individualFirstTimeAnswer: boolean
  individualPartOfSocialNetwork = []

  organisationAwareOfSDG: string;
  organisationPassionateSDGs = [];
  organisationPassionateSDGsNumber: number[] = [];
  organisationPassionateSDGsDoneNumber: number[] = [];
  organisationPassionateSDGTargets = []
  organisationFirstTimeAnswer: boolean
  organisationPartOfSocialNetwork = []

  individualAwareOfSGDAnswers: string[] = [
    'Yes, I have but not sure exactly what it is',
    'Yes, I have and am actively working towards contributing towards it',
    'Yes, but I do not know how to contribute  towards it',
    'No,  this is the first time I am hearing about it'
  ]
  SDGAnswers: string[] = [
    'Goal 1: No Poverty',
    'Goal 2: Zero Hunger',
    'Goal 3: Good Health and Well-being',
    'Goal 4: Quality Education',
    'Goal 5: Gender Equality',
    'Goal 6: Clean Water and Sanitation',
    'Goal 7: Affordable and Clean Energy',
    'Goal 8: Decent Work and Economic Growth',
    'Goal 9: Industry, Innovation and Infrastructure',
    'Goal 10: Reduce Inequalities',
    'Goal 11: Sustainable Cities and Communities',
    'Goal 12: Responsible Consumption and Production',
    'Goal 13: Climate Action',
    'Goal 14: Life Below Water',
    'Goal 15: Life On Land',
    'Goal 16: Peace, Justice and Strong Institutions',
    'Goal 17: Partnerships for the Goals'
  ]

  goal1Selected: boolean = false
  Goal1Targets: string[] = [
    'TARGET 1.1.   By 2030, eradicate extreme poverty for all people everywhere, currently measured as people living on less than $1.25 a day',
    'TARGET 1.2.   By 2030, reduce at least by half the proportion of men, women and children of all ages living in poverty in all its dimensions according to national definitions',
    'TARGET 1.3.   Implement nationally appropriate social protection systems and measures for all, including floors, and by 2030 achieve substantial coverage of the poor and the vulnerable',
    'TARGET 1.4.   By 2030, ensure that all men and women, in particular the poor and the vulnerable, have equal rights to economic resources, as well as access to basic services, ownership and control over land and other forms of property, inheritance, natural resources, appropriate new technology and financial services, including microfinance',
    'TARGET 1.5.   By 2030, build the resilience of the poor and those in vulnerable situations and reduce their exposure and vulnerability to climate-related extreme events and other economic, social and environmental shocks and disasters',
    'TARGET 1.a.   Ensure significant mobilization of resources from a variety of sources, including through enhanced development cooperation, in order to provide adequate and predictable means for developing countries, in particular least developed countries, to implement programmes and policies to end poverty in all its dimensions',
    'TARGET 1.b.   Create sound policy frameworks at the national, regional and international levels, based on pro-poor and gender-sensitive development strategies, to support accelerated investment in poverty eradication actions'
  ];
  goal2Selected: boolean = false
  Goal2Targets: string[] = [
    'TARGET 2.1.   By 2030, end hunger and ensure access by all people, in particular the poor and people in vulnerable situations, including infants, to safe, nutritious and sufficient food all year round',
    'TARGET 2.2.   By 2030, end all forms of malnutrition, including achieving, by 2025, the internationally agreed targets on stunting and wasting in children under 5 years of age, and address the nutritional needs of adolescent girls, pregnant and lactating women and older persons',
    'TARGET 2.3.   By 2030, double the agricultural productivity and incomes of small-scale food producers, in particular women, indigenous peoples, family farmers, pastoralists and fishers, including through secure and equal access to land, other productive resources and inputs, knowledge, financial services, markets and opportunities for value addition and non-farm employment',
    'TARGET 2.4.   By 2030, ensure sustainable food production systems and implement resilient agricultural practices that increase productivity and production, that help maintain ecosystems, that strengthen capacity for adaptation to climate change, extreme weather, drought, flooding and other disasters and that progressively improve land and soil quality',
    'TARGET 2.5.   By 2020, maintain the genetic diversity of seeds, cultivated plants and farmed and domesticated animals and their related wild species, including through soundly managed and diversified seed and plant banks at the national, regional and international levels, and promote access to and fair and equitable sharing of benefits arising from the utilization of genetic resources and associated traditional knowledge, as internationally agreed',
    'TARGET 2.a.   Increase investment, including through enhanced international cooperation, in rural infrastructure, agricultural research and extension services, technology development and plant and livestock gene banks in order to enhance agricultural productive capacity in developing countries, in particular least developed countries',
    'TARGET 2.b.   Correct and prevent trade restrictions and distortions in world agricultural markets, including through the parallel elimination of all forms of agricultural export subsidies and all export measures with equivalent effect, in accordance with the mandate of the Doha Development Round',
    'TARGET 2.c.   Adopt measures to ensure the proper functioning of food commodity markets and their derivatives and facilitate timely access to market information, including on food reserves, in order to help limit extreme food price volatility'
  ]
  goal3Selected: boolean = false
  Goal3Targets: string[] = [
    'TARGET 3.1.   By 2030, reduce the global maternal mortality ratio to less than 70 per 100,000 live births',
    'TARGET 3.2.   By 2030, end preventable deaths of newborns and children under 5 years of age, with all countries aiming to reduce neonatal mortality to at least as low as 12 per 1,000 live births and under-5 mortality to at least as low as 25 per 1,000 live births',
    'TARGET 3.3.   By 2030, end the epidemics of AIDS, tuberculosis, malaria and neglected tropical diseases and combat hepatitis, water-borne diseases and other communicable diseases',
    'TARGET 3.4.   By 2030, reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being',
    'TARGET 3.5.   Strengthen the prevention and treatment of substance abuse, including narcotic drug abuse and harmful use of alcohol',
    'TARGET 3.6.   By 2020, halve the number of global deaths and injuries from road traffic accidents',
    'TARGET 3.7.   By 2030, ensure universal access to sexual and reproductive health-care services, including for family planning, information and education, and the integration of reproductive health into national strategies and programmes',
    'TARGET 3.8.   Achieve universal health coverage, including financial risk protection, access to quality essential health-care services and access to safe, effective, quality and affordable essential medicines and vaccines for all',
    'TARGET 3.9.   By 2030, substantially reduce the number of deaths and illnesses from hazardous chemicals and air, water and soil pollution and contamination',
    'TARGET 3.a.   Strengthen the implementation of the World Health Organization Framework Convention on Tobacco Control in all countries, as appropriate',
    'TARGET 3.b.   Support the research and development of vaccines and medicines for the communicable and non-communicable diseases that primarily affect developing countries, provide access to affordable essential medicines and vaccines, in accordance with the Doha Declaration on the TRIPS Agreement and Public Health, which affirms the right of developing countries to use to the full the provisions in the Agreement on Trade-Related Aspects of Intellectual Property Rights regarding flexibilities to protect public health, and, in particular, provide access to medicines for all',
    'TARGET 3.c.   Substantially increase health financing and the recruitment, development, training and retention of the health workforce in developing countries, especially in least developed countries and small island developing States',
    'TARGET 3.d.   Strengthen the capacity of all countries, in particular developing countries, for early warning, risk reduction and management of national and global health risks'
  ]
  goal4Selected: boolean = false
  Goal4Targets: string[] = [
    'TARGET 4.1.   By 2030, ensure that all girls and boys complete free, equitable and quality primary and secondary education leading to relevant and effective learning outcomes',
    'TARGET 4.2.   By 2030, ensure that all girls and boys have access to quality early childhood development, care and pre-primary education so that they are ready for primary education',
    'TARGET 4.3.   By 2030, ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education, including university',
    'TARGET 4.4.   By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs and entrepreneurship',
    'TARGET 4.5.   By 2030, eliminate gender disparities in education and ensure equal access to all levels of education and vocational training for the vulnerable, including persons with disabilities, indigenous peoples and children in vulnerable situations',
    'TARGET 4.6.   By 2030, ensure that all youth and a substantial proportion of adults, both men and women, achieve literacy and numeracy',
    "TARGET 4.7.   By 2030, ensure that all learners acquire the knowledge and skills needed to promote sustainable development, including, among others, through education for sustainable development and sustainable lifestyles, human rights, gender equality, promotion of a culture of peace and non-violence, global citizenship and appreciation of cultural diversity and of culture's contribution to sustainable development",
    "TARGET 4.a.   Build and upgrade education facilities that are child, disability and gender sensitive and provide safe, non-violent, inclusive and effective learning environments for all",
    "TARGET 4.b.   By 2020, substantially expand globally the number of scholarships available to developing countries, in particular least developed countries, small island developing States and African countries, for enrolment in higher education, including vocational training and information and communications technology, technical, engineering and scientific programmes, in developed countries and other developing countries",
    "TARGET 4.c.   By 2030, substantially increase the supply of qualified teachers, including through international cooperation for teacher training in developing countries, especially least developed countries and small island developing States"
  ]
  goal5Selected: boolean = false
  Goal5Targets: string[] = [
    'TARGET 5.1.   End all forms of discrimination against all women and girls everywhere',
    'TARGET 5.2.   Eliminate all forms of violence against all women and girls in the public and private spheres, including trafficking and sexual and other types of exploitation',
    'TARGET 5.3.   Eliminate all harmful practices, such as child, early and forced marriage and female genital mutilation',
    'TARGET 5.4.   Recognize and value unpaid care and domestic work through the provision of public services, infrastructure and social protection policies and the promotion of shared responsibility within the household and the family as nationally appropriate',
    "TARGET 5.5.   Ensure women's full and effective participation and equal opportunities for leadership at all levels of decision-making in political, economic and public life",
    "TARGET 5.a.   Undertake reforms to give women equal rights to economic resources, as well as access to ownership and control over land and other forms of property, financial services, inheritance and natural resources, in accordance with national laws",
    "TARGET 5.b.   Enhance the use of enabling technology, in particular information and communications technology, to promote the empowerment of women",
    "TARGET 5.c.   Adopt and strengthen sound policies and enforceable legislation for the promotion of gender equality and the empowerment of all women and girls at all levels"
  ]
  goal6Selected: boolean = false
  Goal6Targets: string[] = [
    "TARGET 6.1.   By 2030, achieve universal and equitable access to safe and affordable drinking water for all",
    "TARGET 6.2.   By 2030, achieve access to adequate and equitable sanitation and hygiene for all and end open defecation, paying special attention to the needs of women and girls and those in vulnerable situations",
    "TARGET 6.3.   By 2030, improve water quality by reducing pollution, eliminating dumping and minimizing release of hazardous chemicals and materials, halving the proportion of untreated wastewater and substantially increasing recycling and safe reuse globally",
    "TARGET 6.4.   By 2030, substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals and supply of freshwater to address water scarcity and substantially reduce the number of people suffering from water scarcity",
    "TARGET 6.5.   By 2030, implement integrated water resources management at all levels, including through transboundary cooperation as appropriate",
    "TARGET 6.6.   By 2020, protect and restore water-related ecosystems, including mountains, forests, wetlands, rivers, aquifers and lakes",
    "TARGET 6.a.   By 2030, expand international cooperation and capacity-building support to developing countries in water- and sanitation-related activities and programmes, including water harvesting, desalination, water efficiency, wastewater treatment, recycling and reuse technologies",
    "TARGET 6.b.   Support and strengthen the participation of local communities in improving water and sanitation management"
  ]
  goal7Selected: boolean = false
  Goal7Targets: string[] = [
    "TARGET 7.1.   By 2030, ensure universal access to affordable, reliable and modern energy services",
    "TARGET 7.2.   By 2030, increase substantially the share of renewable energy in the global energy mix",
    "TARGET 7.3.   By 2030, double the global rate of improvement in energy efficiency",
    "TARGET 7.a.   By 2030, enhance international cooperation to facilitate access to clean energy research and technology, including renewable energy, energy efficiency and advanced and cleaner fossil-fuel technology, and promote investment in energy infrastructure and clean energy technology",
    "TARGET 7.b.   By 2030, expand infrastructure and upgrade technology for supplying modern and sustainable energy services for all in developing countries, in particular least developed countries, small island developing States and landlocked developing countries, in accordance with their respective programmes of support"
  ]
  goal8Selected: boolean = false
  Goal8Targets: string[] = [
    "TARGET 8.1.   Sustain per capita economic growth in accordance with national circumstances and, in particular, at least 7 percent gross domestic product growth per annum in the least developed countries",
    "TARGET 8.2.   Achieve higher levels of economic productivity through diversification, technological upgrading and innovation, including through a focus on high-value added and labour-intensive sectors",
    "TARGET 8.3.   Promote development-oriented policies that support productive activities, decent job creation, entrepreneurship, creativity and innovation, and encourage the formalization and growth of micro-, small- and medium-sized enterprises, including through access to financial services",
    "TARGET 8.4.   Improve progressively, through 2030, global resource efficiency in consumption and production and endeavour to decouple economic growth from environmental degradation, in accordance with the 10-Year Framework of Programmes on Sustainable Consumption and Production, with developed countries taking the lead",
    "TARGET 8.5.   By 2030, achieve full and productive employment and decent work for all women and men, including for young people and persons with disabilities, and equal pay for work of equal value",
    "TARGET 8.6.   By 2020, substantially reduce the proportion of youth not in employment, education or training",
    "TARGET 8.7.   Take immediate and effective measures to eradicate forced labour, end modern slavery and human trafficking and secure the prohibition and elimination of the worst forms of child labour, including recruitment and use of child soldiers, and by 2025 end child labour in all its forms",
    "TARGET 8.8.   Protect labour rights and promote safe and secure working environments for all workers, including migrant workers, in particular women migrants, and those in precarious employment",
    "TARGET 8.9.   By 2030, devise and implement policies to promote sustainable tourism that creates jobs and promotes local culture and products",
    "TARGET 8.10.  Strengthen the capacity of domestic financial institutions to encourage and expand access to banking, insurance and financial services for all",
    "TARGET 8.a.   Increase Aid for Trade support for developing countries, in particular least developed countries, including through the Enhanced Integrated Framework for Trade-related Technical Assistance to least developed countries",
    "TARGET 8.b.   By 2020, develop and operationalize a global strategy for youth employment and implement the Global Jobs Pact of the International Labour Organization"
  ]
  goal9Selected: boolean = false
  Goal9Targets: string[] = [
    "TARGET 9.1.   Develop quality, reliable, sustainable and resilient infrastructure, including regional and transborder infrastructure, to support economic development and human well-being, with a focus on affordable and equitable access for all",
    "TARGET 9.2.   Promote inclusive and sustainable industrialization and, by 2030, significantly raise industry's share of employment and gross domestic product, in line with national circumstances, and double its share in least developed countries",
    "TARGET 9.3.   Increase the access of small-scale industrial and other enterprises, in particular in developing countries, to financial services, including affordable credit, and their integration into value chains and markets",
    "TARGET 9.4.   By 2030, upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency and greater adoption of clean and environmentally sound technologies and industrial processes, with all countries taking action in accordance with their respective capabilities",
    "TARGET 9.5.   Enhance scientific research, upgrade the technological capabilities of industrial sectors in all countries, in particular developing countries, including, by 2030, encouraging innovation and substantially increasing the number of research and development workers per 1 million people and public and private research and development spending",
    "TARGET 9.a.   Facilitate sustainable and resilient infrastructure development in developing countries through enhanced financial, technological and technical support to African countries, least developed countries, landlocked developing countries and small island developing States",
    "TARGET 9.b.   Support domestic technology development, research and innovation in developing countries, including by ensuring a conducive policy environment for, inter alia, industrial diversification and value addition to commodities",
    "TARGET 9.c.   Significantly increase access to information and communications technology and strive to provide universal and affordable access to the Internet in least developed countries by 2020"
  ]
  goal10Selected: boolean = false
  Goal10Targets: string[] = [
    "TARGET 10.1.  By 2030, progressively achieve and sustain income growth of the bottom 40 percent of the population at a rate higher than the national average",
    "TARGET 10.2.  By 2030, empower and promote the social, economic and political inclusion of all, irrespective of age, sex, disability, race, ethnicity, origin, religion or economic or other status",
    "TARGET 10.3.  Ensure equal opportunity and reduce inequalities of outcome, including by eliminating discriminatory laws, policies and practices and promoting appropriate legislation, policies and action in this regard",
    "TARGET 10.4.  Adopt policies, especially fiscal, wage and social protection policies, and progressively achieve greater equality",
    "TARGET 10.5.  Improve the regulation and monitoring of global financial markets and institutions and strengthen the implementation of such regulations",
    "TARGET 10.6.  Ensure enhanced representation and voice for developing countries in decision-making in global international economic and financial institutions in order to deliver more effective, credible, accountable and legitimate institutions",
    "TARGET 10.7.  Facilitate orderly, safe, regular and responsible migration and mobility of people, including through the implementation of planned and well-managed migration policies",
    "TARGET 10.a.  Implement the principle of special and differential treatment for developing countries, in particular least developed countries, in accordance with World Trade Organization agreements",
    "TARGET 10.b.  Encourage official development assistance and financial flows, including foreign direct investment, to States where the need is greatest, in particular least developed countries, African countries, small island developing States and landlocked developing countries, in accordance with their national plans and programmes",
    "TARGET 10.c.  By 2030, reduce to less than 3 percent the transaction costs of migrant remittances and eliminate remittance corridors with costs higher than 5 percent"
  ]
  goal11Selected: boolean = false
  Goal11Targets: string[] = [
    "TARGET 11.1.  By 2030, ensure access for all to adequate, safe and affordable housing and basic services and upgrade slums",
    "TARGET 11.2.  By 2030, provide access to safe, affordable, accessible and sustainable transport systems for all, improving road safety, notably by expanding public transport, with special attention to the needs of those in vulnerable situations, women, children, persons with disabilities and older persons",
    "TARGET 11.3.  By 2030, enhance inclusive and sustainable urbanization and capacity for participatory, integrated and sustainable human settlement planning and management in all countries",
    "TARGET 11.4.  Strengthen efforts to protect and safeguard the world's cultural and natural heritage",
    "TARGET 11.5.  By 2030, significantly reduce the number of deaths and the number of people affected and substantially decrease the direct economic losses relative to global gross domestic product caused by disasters, including water-related disasters, with a focus on protecting the poor and people in vulnerable situations",
    "TARGET 11.6.  By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management",
    "TARGET 11.7.  By 2030, provide universal access to safe, inclusive and accessible, green and public spaces, in particular for women and children, older persons and persons with disabilities",
    "TARGET 11.a.  Support positive economic, social and environmental links between urban, peri-urban and rural areas by strengthening national and regional development planning",
    "TARGET 11.b.  By 2020, substantially increase the number of cities and human settlements adopting and implementing integrated policies and plans towards inclusion, resource efficiency, mitigation and adaptation to climate change, resilience to disasters, and develop and implement, in line with the Sendai Framework for Disaster Risk Reduction 2015-2030, holistic disaster risk management at all levels",
    "TARGET 11.c.  Support least developed countries, including through financial and technical assistance, in building sustainable and resilient buildings utilizing local materials"
  ]
  goal12Selected: boolean = false
  Goal12Targets: string[] = [
    "TARGET 12.1.  Implement the 10-Year Framework of Programmes on Sustainable Consumption and Production Patterns, all countries taking action, with developed countries taking the lead, taking into account the development and capabilities of developing countries",
    "TARGET 12.2.  By 2030, achieve the sustainable management and efficient use of natural resources",
    "TARGET 12.3.  By 2030, halve per capita global food waste at the retail and consumer levels and reduce food losses along production and supply chains, including post-harvest losses",
    "TARGET 12.4.  By 2020, achieve the environmentally sound management of chemicals and all wastes throughout their life cycle, in accordance with agreed international frameworks, and significantly reduce their release to air, water and soil in order to minimize their adverse impacts on human health and the environment",
    "TARGET 12.5.  By 2030, substantially reduce waste generation through prevention, reduction, recycling and reuse",
    "TARGET 12.6.  Encourage companies, especially large and transnational companies, to adopt sustainable practices and to integrate sustainability information into their reporting cycle",
    "TARGET 12.7.  Promote public procurement practices that are sustainable, in accordance with national policies and priorities",
    "TARGET 12.8.  By 2030, ensure that people everywhere have the relevant information and awareness for sustainable development and lifestyles in harmony with nature",
    "TARGET 12.a.  Support developing countries to strengthen their scientific and technological capacity to move towards more sustainable patterns of consumption and production",
    "TARGET 12.b.  Develop and implement tools to monitor sustainable development impacts for sustainable tourism that creates jobs and promotes local culture and products",
    "TARGET 12.c.  Rationalize inefficient fossil-fuel subsidies that encourage wasteful consumption by removing market distortions, in accordance with national circumstances, including by restructuring taxation and phasing out those harmful subsidies, where they exist, to reflect their environmental impacts, taking fully into account the specific needs and conditions of developing countries and minimizing the possible adverse impacts on their development in a manner that protects the poor and the affected communities",
  ]
  goal13Selected: boolean = false
  Goal13Targets: string[] = [
    "TARGET 13.1.  Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters in all countries",
    "TARGET 13.2.  Integrate climate change measures into national policies, strategies and planning",
    "TARGET 13.3.  Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, impact reduction and early warning",
    "TARGET 13.a.  Implement the commitment undertaken by developed-country parties to the United Nations Framework Convention on Climate Change to a goal of mobilizing jointly $100 billion annually by 2020 from all sources to address the needs of developing countries in the context of meaningful mitigation actions and transparency on implementation and fully operationalize the Green Climate Fund through its capitalization as soon as possible",
    "TARGET 13.b.  Promote mechanisms for raising capacity for effective climate change-related planning and management in least developed countries and small island developing States, including focusing on women, youth and local and marginalized communities"
  ]
  goal14Selected: boolean = false
  Goal14Targets: string[] = [
    "TARGET 14.1.  By 2025, prevent and significantly reduce marine pollution of all kinds, in particular from land-based activities, including marine debris and nutrient pollution",
    "TARGET 14.2.  By 2020, sustainably manage and protect marine and coastal ecosystems to avoid significant adverse impacts, including by strengthening their resilience, and take action for their restoration in order to achieve healthy and productive oceans",
    "TARGET 14.3.  Minimize and address the impacts of ocean acidification, including through enhanced scientific cooperation at all levels",
    "TARGET 14.4.  By 2020, effectively regulate harvesting and end overfishing, illegal, unreported and unregulated fishing and destructive fishing practices and implement science-based management plans, in order to restore fish stocks in the shortest time feasible, at least to levels that can produce maximum sustainable yield as determined by their biological characteristics",
    "TARGET 14.5.  By 2020, conserve at least 10 percent of coastal and marine areas, consistent with national and international law and based on the best available scientific information",
    "TARGET 14.6.  By 2020, prohibit certain forms of fisheries subsidies which contribute to overcapacity and overfishing, eliminate subsidies that contribute to illegal, unreported and unregulated fishing and refrain from introducing new such subsidies, recognizing that appropriate and effective special and differential treatment for developing and least developed countries should be an integral part of the World Trade Organization fisheries subsidies negotiation",
    "TARGET 14.7.  By 2030, increase the economic benefits to small island developing States and least developed countries from the sustainable use of marine resources, including through sustainable management of fisheries, aquaculture and tourism",
    "TARGET 14.a.  Increase scientific knowledge, develop research capacity and transfer marine technology, taking into account the Intergovernmental Oceanographic Commission Criteria and Guidelines on the Transfer of Marine Technology, in order to improve ocean health and to enhance the contribution of marine biodiversity to the development of developing countries, in particular small island developing States and least developed countries",
    "TARGET 14.b.  Provide access for small-scale artisanal fishers to marine resources and markets",
    "TARGET 14.c.  Enhance the conservation and sustainable use of oceans and their resources by implementing international law as reflected in the United Nations Convention on the Law of the Sea, which provides the legal framework for the conservation and sustainable use of oceans and their resources, as recalled in paragraph 158 of 'The future we want'"
  ]
  goal15Selected: boolean = false
  Goal15Targets: string[] = [
    "TARGET 15.1.  By 2020, ensure the conservation, restoration and sustainable use of terrestrial and inland freshwater ecosystems and their services, in particular forests, wetlands, mountains and drylands, in line with obligations under international agreements",
    "TARGET 15.2.  By 2020, promote the implementation of sustainable management of all types of forests, halt deforestation, restore degraded forests and substantially increase afforestation and reforestation globally",
    "TARGET 15.3.  By 2030, combat desertification, restore degraded land and soil, including land affected by desertification, drought and floods, and strive to achieve a land degradation-neutral world",
    "TARGET 15.4.  By 2030, ensure the conservation of mountain ecosystems, including their biodiversity, in order to enhance their capacity to provide benefits that are essential for sustainable development",
    "TARGET 15.5.  Take urgent and significant action to reduce the degradation of natural habitats, halt the loss of biodiversity and, by 2020, protect and prevent the extinction of threatened species",
    "TARGET 15.6.  Promote fair and equitable sharing of the benefits arising from the utilization of genetic resources and promote appropriate access to such resources, as internationally agreed",
    "TARGET 15.7.  Take urgent action to end poaching and trafficking of protected species of flora and fauna and address both demand and supply of illegal wildlife products",
    "TARGET 15.8.  By 2020, introduce measures to prevent the introduction and significantly reduce the impact of invasive alien species on land and water ecosystems and control or eradicate the priority species",
    "TARGET 15.9.  By 2020, integrate ecosystem and biodiversity values into national and local planning, development processes, poverty reduction strategies and accounts",
    "TARGET 15.a.  Mobilize and significantly increase financial resources from all sources to conserve and sustainably use biodiversity and ecosystems",
    "TARGET 15.b.  Mobilize significant resources from all sources and at all levels to finance sustainable forest management and provide adequate incentives to developing countries to advance such management, including for conservation and reforestation",
    "TARGET 15.c.  Enhance global support for efforts to combat poaching and trafficking of protected species, including by increasing the capacity of local communities to pursue sustainable livelihood opportunities"
  ]
  goal16Selected: boolean = false
  Goal16Targets: string[] = [
    "TARGET 16.1.  Significantly reduce all forms of violence and related death rates everywhere",
    "TARGET 16.2.  End abuse, exploitation, trafficking and all forms of violence against and torture of children",
    "TARGET 16.3.  Promote the rule of law at the national and international levels and ensure equal access to justice for all",
    "TARGET 16.4.  By 2030, significantly reduce illicit financial and arms flows, strengthen the recovery and return of stolen assets and combat all forms of organized crime",
    "TARGET 16.5.  Substantially reduce corruption and bribery in all their forms",
    "TARGET 16.6.  Develop effective, accountable and transparent institutions at all levels",
    "TARGET 16.7.  Ensure responsive, inclusive, participatory and representative decision-making at all levels",
    "TARGET 16.8.  Broaden and strengthen the participation of developing countries in the institutions of global governance",
    "TARGET 16.9.  By 2030, provide legal identity for all, including birth registration",
    "TARGET 16.10. Ensure public access to information and protect fundamental freedoms, in accordance with national legislation and international agreements",
    "TARGET 16.a.  Strengthen relevant national institutions, including through international cooperation, for building capacity at all levels, in particular in developing countries, to prevent violence and combat terrorism and crime",
    "TARGET 16.b.  Promote and enforce non-discriminatory laws and policies for sustainable development"
  ]
  goal17Selected: boolean = false
  Goal17Targets: string[] = [
    "TARGET 17.1.  Strengthen domestic resource mobilization, including through international support to developing countries, to improve domestic capacity for tax and other revenue collection",
    "TARGET 17.2.  Developed countries to implement fully their official development assistance commitments, including the commitment by many developed countries to achieve the target of 0.7 per cent of gross national income for official development assistance (ODA/GNI) to developing countries and 0.15 to 0.20 per cent of ODA/GNI to least developed countries; ODA providers are encouraged to consider setting a target to provide at least 0.20 per cent of ODA/GNI to least developed countries",
    "TARGET 17.3.  Mobilize additional financial resources for developing countries from multiple sources",
    "TARGET 17.4.  Assist developing countries in attaining long-term debt sustainability through coordinated policies aimed at fostering debt financing, debt relief and debt restructuring, as appropriate, and address the external debt of highly indebted poor countries to reduce debt distress",
    "TARGET 17.5.  Adopt and implement investment promotion regimes for least developed countries",
    "TARGET 17.6.  Enhance North-South, South-South and triangular regional and international cooperation on and access to science, technology and innovation and enhance knowledge-sharing on mutually agreed terms, including through improved coordination among existing mechanisms, in particular at the United Nations level, and through a global technology facilitation mechanism",
    "TARGET 17.7.  Promote the development, transfer, dissemination and diffusion of environmentally sound technologies to developing countries on favourable terms, including on concessional and preferential terms, as mutually agreed",
    "TARGET 17.8.  Fully operationalize the technology bank and science, technology and innovation capacity-building mechanism for least developed countries by 2017 and enhance the use of enabling technology, in particular information and communications technology",
    "TARGET 17.9.  Enhance international support for implementing effective and targeted capacity-building in developing countries to support national plans to implement all the Sustainable Development Goals, including through North-South, South-South and triangular cooperation",
    "TARGET 17.10. Promote a universal, rules-based, open, non-discriminatory and equitable multilateral trading system under the World Trade Organization, including through the conclusion of negotiations under its Doha Development Agenda",
    "TARGET 17.11. Significantly increase the exports of developing countries, in particular with a view to doubling the least developed countries' share of global exports by 2020",
    "TARGET 17.12. Realize timely implementation of duty-free and quota-free market access on a lasting basis for all least developed countries, consistent with World Trade Organization decisions, including by ensuring that preferential rules of origin applicable to imports from least developed countries are transparent and simple, and contribute to facilitating market access",
    "TARGET 17.13. Enhance global macroeconomic stability, including through policy coordination and policy coherence",
    "TARGET 17.14. Enhance policy coherence for sustainable development",
    "TARGET 17.15. Respect each country's policy space and leadership to establish and implement policies for poverty eradication and sustainable development",
    "TARGET 17.16. Enhance the Global Partnership for Sustainable Development, complemented by multi-stakeholder partnerships that mobilize and share knowledge, expertise, technology and financial resources, to support the achievement of the Sustainable Development Goals in all countries, in particular developing countries",
    "TARGET 17.17. Encourage and promote effective public, public-private and civil society partnerships, building on the experience and resourcing strategies of partnerships",
    "TARGET 17.18. By 2020, enhance capacity-building support to developing countries, including for least developed countries and small island developing States, to increase significantly the availability of high-quality, timely and reliable data disaggregated by income, gender, age, race, ethnicity, migratory status, disability, geographic location and other characteristics relevant in national contexts",
    "TARGET 17.19. By 2030, build on existing initiatives to develop measurements of progress on sustainable development that complement gross domestic product, and support statistical capacity-building in developing countries"
  ]

  individualFirstTimeOnSDG: string[] = ["Yes","No"];

  partOfSocialImpanctNetwork: string[] = [
    "Ashoka",
    "Schwab Foundation",
    "Skoll Foundation",
    "Echoing Green",
    "Acumen",
    "Catalyst2030",
    "RaiSE Singapore"
  ]

  organisationAwareOfSGDAnswers: string[] = [
    "Yes, but we are not sure exactly what it is",
    "Yes, we are actively  working towards contributing towards it",
    "Yes, but we do not  know how to contribute  towards it",
    "No, this is the first time we are hearing about it"

  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private sessionService: SessionService,
    private tagService: TagService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.sessionService.getCurrentUser()
    if(this.currentUser.completedQuestionnaire == false){
      $('#modal-survey').modal('show');
    }
    this.tagService.getAllSDGTags().subscribe(
      response => {
        this.allSDGTags = response
      }
    )

  }

  closeModal(){
    $("#modal-survey .close").click();
  }

  startSurvey(){
    this.questionNumber = 1
  }

  next(){
    this.questionNumber += 1
  }

  //inidividual first question
  answerIndividualAwareOfSDG(i){
    this.individualAwareOfSDG = this.individualAwareOfSGDAnswers[i];
    if(this.individualAwareOfSGDAnswers[i] == "Yes, I have but not sure exactly what it is" || this.individualAwareOfSGDAnswers[i] == "No,  this is the first time I am hearing about it"){
      this.questionNumber = 1.5
    }
    else{
      this.questionNumber = 2
    }
  }

  //organisation first question
  answerOrganisationAwareOfSDG(i){
    this.organisationAwareOfSDG = this.organisationAwareOfSGDAnswers[i];
    if(this.organisationAwareOfSGDAnswers[i] == "Yes, but we are not sure exactly what it is" || this.organisationAwareOfSGDAnswers[i] == "No, this is the first time we are hearing about it"){
      this.questionNumber = 1.5
    }
    else{
      this.questionNumber = 2
    }
  }

  goToQuestion2(){
    this.questionNumber = 2
  }

  organisationGoToQuestion2(){
    if(this.organisationAwareOfSDG == "No, this is the first time we are hearing about it"){
      $("#modal-survey").modal("hide")
      this.router.navigate(['sdgInfo'])
    }
    else{
      this.questionNumber = 2
    }
  }

  // individual question 2
  onQuestion2CheckboxChange(event, sdg){
    if(event.target.checked){
      this.individualPassionateSDGs.push(event.target.value);
      console.log(sdg + ' Checked');
      if(sdg == this.SDGAnswers[0]){
        this.goal1Selected = true;
        this.individualPassionateSDGsNumber.push(1);
        console.log('goal1selected: true')
      }
      else if(sdg == this.SDGAnswers[1]){
        this.goal2Selected = true
        this.individualPassionateSDGsNumber.push(2);
        console.log('goal2selected: true')
      }
      else if(sdg == this.SDGAnswers[2]){
        this.goal3Selected = true
        this.individualPassionateSDGsNumber.push(3);
        console.log('goal3selected: true')
      }
      else if(sdg == this.SDGAnswers[3]){
        this.goal4Selected = true
        this.individualPassionateSDGsNumber.push(4);
        console.log('goal4selected: true')
      }
      else if(sdg == this.SDGAnswers[4]){
        this.goal5Selected = true
        this.individualPassionateSDGsNumber.push(5);
        console.log('goal5selected: true')
      }
      else if(sdg == this.SDGAnswers[5]){
        this.goal6Selected = true
        this.individualPassionateSDGsNumber.push(6);
        console.log('goal6selected: true')
      }
      else if(sdg == this.SDGAnswers[6]){
        this.goal7Selected = true
        this.individualPassionateSDGsNumber.push(7);
        console.log('goal7selected: true')
      }
      else if(sdg == this.SDGAnswers[7]){
        this.goal8Selected = true
        this.individualPassionateSDGsNumber.push(8);
        console.log('goal8selected: true')
      }
      else if(sdg == this.SDGAnswers[8]){
        this.goal9Selected = true
        this.individualPassionateSDGsNumber.push(9);
        console.log('goal9selected: true')
      }
      else if(sdg == this.SDGAnswers[9]){
        this.goal10Selected = true
        this.individualPassionateSDGsNumber.push(10);
        console.log('goal10selected: true')
      }
      else if(sdg == this.SDGAnswers[10]){
        this.goal11Selected = true
        this.individualPassionateSDGsNumber.push(11);
        console.log('goal11selected: true')
      }
      else if(sdg == this.SDGAnswers[11]){
        this.goal12Selected = true
        this.individualPassionateSDGsNumber.push(12);
        console.log('goal12selected: true')
      }
      else if(sdg == this.SDGAnswers[12]){
        this.goal13Selected = true
        this.individualPassionateSDGsNumber.push(13);
        console.log('goal13selected: true')
      }
      else if(sdg == this.SDGAnswers[13]){
        this.goal14Selected = true
        this.individualPassionateSDGsNumber.push(14);
        console.log('goal14selected: true')
      }
      else if(sdg == this.SDGAnswers[14]){
        this.goal15Selected = true
        this.individualPassionateSDGsNumber.push(15);
        console.log('goal15selected: true')
      }
      else if(sdg == this.SDGAnswers[15]){
        this.goal16Selected = true
        this.individualPassionateSDGsNumber.push(16);
        console.log('goal16selected: true')
      }
      else if(sdg == this.SDGAnswers[16]){
        this.goal17Selected = true
        this.individualPassionateSDGsNumber.push(17);
        console.log('goal17selected: true')
      }
    }
    else{
      console.log(sdg + ' Unchecked');
      this.individualPassionateSDGs =  this.individualPassionateSDGs.filter(m=>m!=sdg)
      if(sdg == this.SDGAnswers[0]){
        this.goal1Selected = false;
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=1)
        console.log('goal1selected: false')
      }
      else if(sdg == this.SDGAnswers[1]){
        this.goal2Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=2)
        console.log('goal2selected: false')
      }
      else if(sdg == this.SDGAnswers[2]){
        this.goal3Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=3)
        console.log('goal3selected: false')
      }
      else if(sdg == this.SDGAnswers[3]){
        this.goal4Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=4)
        console.log('goal4selected: false')
      }
      else if(sdg == this.SDGAnswers[4]){
        this.goal5Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=5)
        console.log('goal5selected: false')
      }
      else if(sdg == this.SDGAnswers[5]){
        this.goal6Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=6)
        console.log('goal6selected: false')
      }
      else if(sdg == this.SDGAnswers[6]){
        this.goal7Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=7)
        console.log('goal7selected: false')
      }
      else if(sdg == this.SDGAnswers[7]){
        this.goal8Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=8)
        console.log('goal8selected: false')
      }
      else if(sdg == this.SDGAnswers[8]){
        this.goal9Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=9)
        console.log('goal9selected: false')
      }
      else if(sdg == this.SDGAnswers[9]){
        this.goal10Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=10)
        console.log('goal10selected: false')
      }
      else if(sdg == this.SDGAnswers[10]){
        this.goal11Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=11)
        console.log('goal11selected: false')
      }
      else if(sdg == this.SDGAnswers[11]){
        this.goal12Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=12)
        console.log('goal12selected: false')
      }
      else if(sdg == this.SDGAnswers[12]){
        this.goal13Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=13)
        console.log('goal13selected: false')
      }
      else if(sdg == this.SDGAnswers[13]){
        this.goal14Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=14)
        console.log('goal14selected: false')
      }
      else if(sdg == this.SDGAnswers[14]){
        this.goal15Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=15)
        console.log('goal15selected: false')
      }
      else if(sdg == this.SDGAnswers[15]){
        this.goal16Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=16)
        console.log('goal16selected: false')
      }
      else if(sdg == this.SDGAnswers[16]){
        this.goal17Selected = false
        this.individualPassionateSDGsNumber =  this.individualPassionateSDGsNumber.filter(m=>m!=17)
        console.log('goal17selected: false')
      }
    }
    this.individualPassionateSDGsNumber.sort((a,b) => a-b)
    console.log( this.individualPassionateSDGsNumber)
    console.log( this.individualPassionateSDGs)
  }

  //organisation question 2
  onOrganisationQuestion2CheckboxChange(event, sdg){
    if(event.target.checked){
      this.organisationPassionateSDGs.push(event.target.value);
      console.log(sdg + ' Checked');
      if(sdg == this.SDGAnswers[0]){
        this.goal1Selected = true;
        this.organisationPassionateSDGsNumber.push(1);
        console.log('goal1selected: true')
      }
      else if(sdg == this.SDGAnswers[1]){
        this.goal2Selected = true
        this.organisationPassionateSDGsNumber.push(2);
        console.log('goal2selected: true')
      }
      else if(sdg == this.SDGAnswers[2]){
        this.goal3Selected = true
        this.organisationPassionateSDGsNumber.push(3);
        console.log('goal3selected: true')
      }
      else if(sdg == this.SDGAnswers[3]){
        this.goal4Selected = true
        this.organisationPassionateSDGsNumber.push(4);
        console.log('goal4selected: true')
      }
      else if(sdg == this.SDGAnswers[4]){
        this.goal5Selected = true
        this.organisationPassionateSDGsNumber.push(5);
        console.log('goal5selected: true')
      }
      else if(sdg == this.SDGAnswers[5]){
        this.goal6Selected = true
        this.organisationPassionateSDGsNumber.push(6);
        console.log('goal6selected: true')
      }
      else if(sdg == this.SDGAnswers[6]){
        this.goal7Selected = true
        this.organisationPassionateSDGsNumber.push(7);
        console.log('goal7selected: true')
      }
      else if(sdg == this.SDGAnswers[7]){
        this.goal8Selected = true
        this.organisationPassionateSDGsNumber.push(8);
        console.log('goal8selected: true')
      }
      else if(sdg == this.SDGAnswers[8]){
        this.goal9Selected = true
        this.organisationPassionateSDGsNumber.push(9);
        console.log('goal9selected: true')
      }
      else if(sdg == this.SDGAnswers[9]){
        this.goal10Selected = true
        this.organisationPassionateSDGsNumber.push(10);
        console.log('goal10selected: true')
      }
      else if(sdg == this.SDGAnswers[10]){
        this.goal11Selected = true
        this.organisationPassionateSDGsNumber.push(11);
        console.log('goal11selected: true')
      }
      else if(sdg == this.SDGAnswers[11]){
        this.goal12Selected = true
        this.organisationPassionateSDGsNumber.push(12);
        console.log('goal12selected: true')
      }
      else if(sdg == this.SDGAnswers[12]){
        this.goal13Selected = true
        this.organisationPassionateSDGsNumber.push(13);
        console.log('goal13selected: true')
      }
      else if(sdg == this.SDGAnswers[13]){
        this.goal14Selected = true
        this.organisationPassionateSDGsNumber.push(14);
        console.log('goal14selected: true')
      }
      else if(sdg == this.SDGAnswers[14]){
        this.goal15Selected = true
        this.organisationPassionateSDGsNumber.push(15);
        console.log('goal15selected: true')
      }
      else if(sdg == this.SDGAnswers[15]){
        this.goal16Selected = true
        this.organisationPassionateSDGsNumber.push(16);
        console.log('goal16selected: true')
      }
      else if(sdg == this.SDGAnswers[16]){
        this.goal17Selected = true
        this.organisationPassionateSDGsNumber.push(17);
        console.log('goal17selected: true')
      }
    }
    else{
      console.log(sdg + ' Unchecked');
      this.organisationPassionateSDGs =  this.organisationPassionateSDGs.filter(m=>m!=sdg)
      if(sdg == this.SDGAnswers[0]){
        this.goal1Selected = false;
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=1)
        console.log('goal1selected: false')
      }
      else if(sdg == this.SDGAnswers[1]){
        this.goal2Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=2)
        console.log('goal2selected: false')
      }
      else if(sdg == this.SDGAnswers[2]){
        this.goal3Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=3)
        console.log('goal3selected: false')
      }
      else if(sdg == this.SDGAnswers[3]){
        this.goal4Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=4)
        console.log('goal4selected: false')
      }
      else if(sdg == this.SDGAnswers[4]){
        this.goal5Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=5)
        console.log('goal5selected: false')
      }
      else if(sdg == this.SDGAnswers[5]){
        this.goal6Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=6)
        console.log('goal6selected: false')
      }
      else if(sdg == this.SDGAnswers[6]){
        this.goal7Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=7)
        console.log('goal7selected: false')
      }
      else if(sdg == this.SDGAnswers[7]){
        this.goal8Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=8)
        console.log('goal8selected: false')
      }
      else if(sdg == this.SDGAnswers[8]){
        this.goal9Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=9)
        console.log('goal9selected: false')
      }
      else if(sdg == this.SDGAnswers[9]){
        this.goal10Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=10)
        console.log('goal10selected: false')
      }
      else if(sdg == this.SDGAnswers[10]){
        this.goal11Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=11)
        console.log('goal11selected: false')
      }
      else if(sdg == this.SDGAnswers[11]){
        this.goal12Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=12)
        console.log('goal12selected: false')
      }
      else if(sdg == this.SDGAnswers[12]){
        this.goal13Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=13)
        console.log('goal13selected: false')
      }
      else if(sdg == this.SDGAnswers[13]){
        this.goal14Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=14)
        console.log('goal14selected: false')
      }
      else if(sdg == this.SDGAnswers[14]){
        this.goal15Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=15)
        console.log('goal15selected: false')
      }
      else if(sdg == this.SDGAnswers[15]){
        this.goal16Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=16)
        console.log('goal16selected: false')
      }
      else if(sdg == this.SDGAnswers[16]){
        this.goal17Selected = false
        this.organisationPassionateSDGsNumber =  this.organisationPassionateSDGsNumber.filter(m=>m!=17)
        console.log('goal17selected: false')
      }
    }
    this.organisationPassionateSDGsNumber.sort((a,b) => a-b)
    console.log( this.organisationPassionateSDGsNumber)
    console.log( this.organisationPassionateSDGs)
  }

  //next button for individual targets
  onNextPassionateSDG(){
    if(this.individualPassionateSDGsNumber.length == 0){
      this.questionNumber = 20
    }
    else{
      let nextPage = this.individualPassionateSDGsNumber.splice(0,1)
      this.individualPassionateSDGsDoneNumber.push(nextPage[0]);
      this.questionNumber = nextPage[0]+2
    }
    console.log(this.individualPassionateSDGTargets);
  }

  //next button for organisation targets
  onOrganisationNextPassionateSDG(){
    if(this.organisationPassionateSDGsNumber.length == 0){
      this.questionNumber = 20
    }
    else{
      let nextPage = this.organisationPassionateSDGsNumber.splice(0,1)
      this.organisationPassionateSDGsDoneNumber.push(nextPage[0]);
      this.questionNumber = nextPage[0]+2
    }
    console.log(this.organisationPassionateSDGTargets);
  }

  // when individual clicks a sdg target
  onTargetCheckboxChange(event, target){
    if(event.target.checked){
      this.individualPassionateSDGTargets.push(event.target.value)
    }
    else{
      this.individualPassionateSDGTargets =  this.individualPassionateSDGTargets.filter(m=>m!=target)
    }
  }

  // when organisation clicks a sdg target
  onOrganisationTargetCheckboxChange(event, target){
    if(event.target.checked){
      this.organisationPassionateSDGTargets.push(event.target.value)
    }
    else{
      this.organisationPassionateSDGTargets =  this.organisationPassionateSDGTargets.filter(m=>m!=target)
    }
  }

  //individual first time question
  onItemChange(event){
    if(event.target.value == "Yes"){
      this.individualFirstTimeAnswer = false
    }
    else{
      this.individualFirstTimeAnswer = true
    }

    console.log(this.individualFirstTimeAnswer)
  }

  //organisation first time question
  onOrganisationItemChange(event){
    if(event.target.value == "Yes"){
      this.organisationFirstTimeAnswer = false
    }
    else{
      this.organisationFirstTimeAnswer = true
    }

    console.log(this.organisationFirstTimeAnswer)
  }

  // individual selecting impact network
  onNetworkCheckboxChange(event, network){
    if(event.target.checked){
      this.individualPartOfSocialNetwork.push(event.target.value)
    }
    else{
      this.individualPartOfSocialNetwork =  this.individualPartOfSocialNetwork.filter(m=>m!=network)
    }
  }

  // organisation selecting impact network
  onOrganisationNetworkCheckboxChange(event, network){
    if(event.target.checked){
      this.organisationPartOfSocialNetwork.push(event.target.value)
    }
    else{
      this.organisationPartOfSocialNetwork =  this.organisationPartOfSocialNetwork.filter(m=>m!=network)
    }
  }

  onIndividualFinish(){
    this.individualQuestinnaire.awareOfSDG = this.individualAwareOfSDG
    this.individualQuestinnaire.passionateSDG = this.individualPassionateSDGs
    this.individualQuestinnaire.passionateTargets = this.individualPassionateSDGTargets
    this.individualQuestinnaire.firstTimeOnSDG = this.individualFirstTimeAnswer
    this.individualQuestinnaire.partOfSocialImpactNetwork = this.individualPartOfSocialNetwork
    for(let goal of this.individualPassionateSDGs){
      if(goal == this.SDGAnswers[0]){
        console.log(goal == this.SDGAnswers[0])
        this.selectedTags.push(this.allSDGTags.find(e => e.name =='SDG 1' ))
        console.log(this.selectedTags);
      }
      else if(goal == this.SDGAnswers[1]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 2' ))
      }
      else if(goal == this.SDGAnswers[2]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 3' ))
      }
      else if(goal == this.SDGAnswers[3]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 4' ))
      }
      else if(goal == this.SDGAnswers[4]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 5' ))
      }
      else if(goal == this.SDGAnswers[5]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 6' ))
      }
      else if(goal == this.SDGAnswers[6]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 7' ))
      }
      else if(goal == this.SDGAnswers[7]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 8' ))
      }
      else if(goal == this.SDGAnswers[8]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 9' ))
      }
      else if(goal == this.SDGAnswers[9]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 10' ))
      }
      else if(goal == this.SDGAnswers[10]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 11' ))
      }
      else if(goal == this.SDGAnswers[11]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 12' ))
      }
      else if(goal == this.SDGAnswers[12]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 13' ))
      }
      else if(goal == this.SDGAnswers[13]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 14' ))
      }
      else if(goal == this.SDGAnswers[14]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 15' ))
      }
      else if(goal == this.SDGAnswers[15]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 16' ))
      }
      else if(goal == this.SDGAnswers[16]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 17' ))
      }

    }

    this.userService.submitIndividualQuestionnaire(this.currentUser.userId, this.individualQuestinnaire, this.selectedTags).subscribe(
      response=>{
        // let user: User = response
        // this.sessionService.setCurrentUser(user);
        $("#modal-survey").modal("hide")
      }, error =>{
        $("#modal-survey").modal("hide")
      }
    )

    // individualAwareOfSDG: string;
    // individualPassionateSDGs = [];
    // individualPassionateSDGsNumber: number[] = [];
    // individualPassionateSDGsDoneNumber: number[] = [];
    // individualPassionateSDGTargets = []
    // individualFirstTimeAnswer: boolean
    // individualPartOfSocialNetwork = []
  }

  onOrganisationFinish(){
    this.organisationQuestionnaire.awareOfSDG = this.organisationAwareOfSDG
    this.organisationQuestionnaire.workingOnSDG = this.organisationPassionateSDGs
    this.organisationQuestionnaire.workingOnTargets = this.organisationPassionateSDGTargets
    this.organisationQuestionnaire.partOfSocialImpactNetwork = this.organisationPartOfSocialNetwork
    for(let goal of this.organisationPassionateSDGs){
      if(goal == this.SDGAnswers[0]){
        console.log(goal == this.SDGAnswers[0])
        this.selectedTags.push(this.allSDGTags.find(e => e.name =='SDG 1' ))
        console.log(this.selectedTags);
      }
      else if(goal == this.SDGAnswers[1]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 2' ))
      }
      else if(goal == this.SDGAnswers[2]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 3' ))
      }
      else if(goal == this.SDGAnswers[3]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 4' ))
      }
      else if(goal == this.SDGAnswers[4]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 5' ))
      }
      else if(goal == this.SDGAnswers[5]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 6' ))
      }
      else if(goal == this.SDGAnswers[6]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 7' ))
      }
      else if(goal == this.SDGAnswers[7]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 8' ))
      }
      else if(goal == this.SDGAnswers[8]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 9' ))
      }
      else if(goal == this.SDGAnswers[9]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 10' ))
      }
      else if(goal == this.SDGAnswers[10]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 11' ))
      }
      else if(goal == this.SDGAnswers[11]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 12' ))
      }
      else if(goal == this.SDGAnswers[12]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 13' ))
      }
      else if(goal == this.SDGAnswers[13]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 14' ))
      }
      else if(goal == this.SDGAnswers[14]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 15' ))
      }
      else if(goal == this.SDGAnswers[15]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 16' ))
      }
      else if(goal == this.SDGAnswers[16]){
        this.selectedTags.push(this.allSDGTags.find(e => e.name ==='SDG 17' ))
      }

    }

    this.userService.submitOrganisationQuestionnaire(this.currentUser.userId, this.organisationQuestionnaire, this.selectedTags).subscribe(
      response=>{
        // let user: User = response
        // this.sessionService.setCurrentUser(user);
        $("#modal-survey").modal("hide")
      }, error =>{
        $("#modal-survey").modal("hide")
      }
    )

    // individualAwareOfSDG: string;
    // individualPassionateSDGs = [];
    // individualPassionateSDGsNumber: number[] = [];
    // individualPassionateSDGsDoneNumber: number[] = [];
    // individualPassionateSDGTargets = []
    // individualFirstTimeAnswer: boolean
    // individualPartOfSocialNetwork = []
  }

}
