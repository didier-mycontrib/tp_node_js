REM lancer si besoin le service mysql (net start mysql)
set MYSQL_HOME=C:\Program Files\MySQL\MySQL Server 5.7
cd /d %~dp0
REM "%MYSQL_HOME%\bin\mysql"  -u root -p < display-db.sql
"%MYSQL_HOME%\bin\mysql"  -u root -proot < display-db2.sql
pause