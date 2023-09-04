# Rent-a-car-App (Web Programming)

To set up Eclipse for Java and web development, follow these steps:

1) Make sure you have Eclipse IDE for Java and Web Developers installed.

2) Check the port configuration in the Apache folder (if it's set to 8080 as default, it might not work).

    Navigate to the Apache folder -> conf -> server.xml 

    Locate the <Connector port="8001" line (approximately line 69) and change the port to something other than 8080 (in this case, it's set to 8001):

    <Connector port="8001" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

3) Configure the server in Eclipse:

    Go to Window -> Preferences -> Server -> Runtime Environments.
    Click "Add" and choose "Apache" -> "Apache Tomcat v9.0" -> "Next".
    Browse to the location of your Apache folder and click "Finish".

4) Verify the JRE System Library configuration:

    Right-click on your project -> Build Path -> Configure Build Path.
    In the "Java Build Path" window, go to "Order and Export".
    Check if there is a [unbound] entry next to "JRE System Library".
    If it's unbound, click on the "Libraries" tab and click "Add Library".
    Select "JRE System Library" and choose the desired JRE version.

5) Running your project:

    Right-click on your project -> Run as -> Run on Server.
