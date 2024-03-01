# iReach - Leads? In it to win it!

Try out the app here: [iReach](https://ireach-dodfh.mongodbstitch.com/)
\
\
Okay! Ritchie is giving a hint!\
![leads](https://github.com/sandhyadev01/Hackathon2024_IndiaSA/assets/30409471/55686f93-025d-4c5c-b25f-0e98df95f494)


## Team Details
Team Name: India SA Team\
Members: 10
- Ajay Raghav
- Nitin Mukheja
- Rajat Bhasin
- Vinod Krishnan
- Rashi Yadav
- Siddharth Gupta
- Vinay Agarwal
- Himanshumali
- Sandhya Dev
- Aditya Kishore


Demo Video: [Link Here!]


## Business Problem Today
Sales and marketing professionals often struggle to craft personalized emails that effectively engage potential leads, resulting in lower conversion rates and wasted efforts.
A lot of events, mass mails, cold calls ... and then some more!\
A lot of work goes here and a small % gets converted to decent amount of leads which are then sent to SDRs.\
The work doesn't end here.

Issue with this:
- Generic Content & Lack of Personalisation
- Manual Work & Time Constraint
- Limited Data Insights
- Poor Data Segmentation and hence, Limited Audience Targeting
- Ineffective Communication



## What does iReach do?
TLDR: Better Lead Conversions!


Introducing iReach, the avant-garde marketing automation platform that revolutionizes how businesses engage with prospects. By leveraging the latest in AI-driven personalization, including cutting-edge embedding models and vector search technologies, iReach delivers unparalleled context and relevance in every email. This sophisticated approach ensures that each message is not only personalized but also deeply resonant with the recipient's current needs and interests, significantly boosting engagement and conversion rates. iReach goes further by incorporating relevant proof points into communications, enhancing client interactions by vividly demonstrating the value of your product. With seamless integration, comprehensive analytics for ongoing refinement, and a commitment to genuine connection, iReach transforms cold outreach into a dynamic, personalized conversation.

_Welcome to iReach, where every email is an opportunity to connect, engage, and grow with purpose._

## iReach Tech Stack: 
- OpenAI (text-embedding-ada-002, gpt-3.5-turbo-16k)
- Atlas Search
- Atlas Vector Search
- Time-Series Collections
- Atlas Charts
- Atlas App Services (Triggers, Functions Hosting, HTTPS Endpoints)
- MERN

## Architecture:
[Content to be added]



## What's the cake? 

### Results
You can see customised e-mail templates based on the industry. Also, you can mention your Name(Ex:John Doe) and Designation(Ex: Solutions Architect) for mail generation and a proper mail will be generated along with a MongoDB Customer Story (a.k.a Proof Points 😃)
\
This will lead to better conversion rates since the customer now has access to a well-curated response + a proof point to strengthen the response.

That's not all!

The logged in User will be able to see really cool dashboards that gives an overview of deals segregated by their stages, the metrics for # of e-mails sent vs # of e-mail responses.  
<br /><br />
iReach uses cool Search features like Fuzzy Search & Autocomplete Search:
![Fuzzy](https://github.com/sandhyadev01/Hackathon2024_IndiaSA/blob/aee92aeb20d62599693e6f7d9027fdb32974ad91/FuzzySearch_Autocomplete.png)

<br /><br />
Next, a Sales Exec searches for a use-case and generates e-mail for one of the customers. 
The mail content can be curated to be more deal and business-centric.
### _Cherry on the cake: Links to MongoDB Proof Points!_
![SalesExec](https://github.com/sandhyadev01/Hackathon2024_IndiaSA/blob/aee92aeb20d62599693e6f7d9027fdb32974ad91/Retail_SalesExec_MailGen.png)

<br /><br />

Similary, a Solutions Architect can use iReach too for generating a technical e-mail content:
![SAMailGen](https://github.com/sandhyadev01/Hackathon2024_IndiaSA/blob/aee92aeb20d62599693e6f7d9027fdb32974ad91/SA_TechnicalMailGen.png)

<br /><br />
Up Next: the user will be able to see Dashboards and Charts metrics for their deals in their specific stages, # of mails sent vs responded, outreach reports, etc:
![ChartsDashboard](https://github.com/sandhyadev01/Hackathon2024_IndiaSA/blob/aee92aeb20d62599693e6f7d9027fdb32974ad91/ChartsDashboard.png)

<br /><br />
Psst... Number of e-mails sent and e-mails responded is a chart built on Time-Series Collection.\
**_So, I'm basically looking at Leads Conversion Rate powered by Time-Series Collections 🤍_**



That's all Folks!\
Fin!
