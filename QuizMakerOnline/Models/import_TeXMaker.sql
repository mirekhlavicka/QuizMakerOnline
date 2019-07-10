insert into Courses
(
	id_course,name,code,min_id_category,max_id_category
)
values
(
	2000,'FEKT - pøijímaèky', 'PFEKT',1001,1100
)

insert into Courses
(
	id_course,name,code,min_id_category,max_id_category
)
values
(
	2001,'FIT - pøijímaèky', 'PFIT',1101,1200
)

insert into UserCourseRights
(
	id_course, id_user, rights
)
values
(
	2000, 1, 15
)

insert into UserCourseRights
(
	id_course, id_user, rights
)
values
(
	2001, 1, 15
)

insert into QuestionCategories
(
	id_category,id_course,name,points,count_per_test
)
select
	id_category + 1000,2000,name,points,count_per_test  
from 
	TexMaker..QuestionCategories 
where 
	name like 'fekt%'

insert into QuestionCategories
(
	id_category,id_course,name,points,count_per_test
)
select
	id_category + 1000,2001,name,points,count_per_test  
from 
	TexMaker..QuestionCategories 
where 
	name like 'fit%'

set identity_insert Users on
insert into Users
(
	ID_USER,LOGIN_NAME,FULL_NAME,PASSWORD,DESCRIPTION
)
values
(
	110,'hlavickova','HLAVIÈKOVÁ Irena','plotenka19',''
)
set identity_insert Users off


insert into UserCourseRights
(
	id_course, id_user, rights
)
values
(
	2000, 110, 15
)

insert into UserCourseRights
(
	id_course, id_user, rights
)
values
(
	2001, 110, 15
)

set identity_insert Questions on
insert into Questions
(
	id_question,id_category,id_user,id_question_type,id_question_difficulty,points,question,right_answer,solution,enter_date,state
)
select
	id_question + 2000,q.id_category+1000,110,1,2,points,question,right_answer,'',getdate(),1
from
	TexMaker..Questions q join
	TexMaker..QuestionCategories c on q.id_category=c.id_category

set identity_insert Questions off


insert into Answers
(
	id_question,position,answer,points
)
select
	id_question  + 2000 ,position,answer,0
from
	TexMaker..Answers


set identity_insert tests on
insert into Tests
(
	id_test,id_user,id_course,id_semester,[group],year,enter_date
)
select
	1000 + id_test,110,2000,isnull((select top 1 id_semester from Semesters where year(dateto)=[year] order by id_semester desc),1),[group],year,getdate()  
from 
	TexMaker..Tests 
where 
	id_test in (select id_test from TexMaker..TestQuestions t join TexMaker..Questions q on t.id_question=q.id_question join TexMaker..QuestionCategories c on q.id_category=c.id_category where c.name like 'fekt%')


insert into Tests
(
	id_test,id_user,id_course,id_semester,[group],year,enter_date
)
select
	1000 + id_test,110,2001,isnull((select top 1 id_semester from Semesters where year(dateto)=[year] order by id_semester desc),1),[group],year,getdate()  
from 
	TexMaker..Tests 
where 
	id_test in (select id_test from TexMaker..TestQuestions t join TexMaker..Questions q on t.id_question=q.id_question join TexMaker..QuestionCategories c on q.id_category=c.id_category where c.name like 'fit%') and
	id_test + 1000 not in (select id_test from tests)

set identity_insert tests off

insert into TestQuestions
(
	id_question,id_test,[order],right_answer
)
select
	2000+id_question,1000+id_test,[order],right_answer
from
	TexMaker..TestQuestions