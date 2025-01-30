# Rent-a-Car App

## Overview

The **Rent-a-Car App** is a web-based vehicle rental platform developed for the **Web Programming** course at the **Faculty of Technical Sciences, Novi Sad**. Built using **JAX-RS REST** (backend) and **Vue.js** (frontend), the app allows users to browse and book vehicles of their choice. The system supports three user roles: customers, managers, and administrators. The class diagram is available [here](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/classDiagram/model-class-diagram.jpg). The application demo can be downloaded [here]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_demo/demo.mkv).

## Key Features

### General (for all users):
- Browse companies
![Browse companies](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/common/home.png)
- Browse vehicles listed by the company
![Browse vehicles](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/common/selectedRentACar.png)

### Non-Registered Users:
- Register an account
![Register](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/common/register.png)
- Log in
![Log in](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/common/login.png)

### Registered Users:
- View and edit profile information
![Profile]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/common/userProfile.png)
### Customers:
- Book and cancel rentals
![Book and cancel rentals]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/customer/rentVehicle.png)
- View rental history
![View rental history](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/customer/orders.png)
![Show order]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/customer/showOrder.png)
- Leave comments and rate vehicles
![Comment]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/customer/comment.png)
![Show order]( https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/customer/showOrder.png)

### Managers:
- Manage vehicles (add/edit)
![Manage vehicles](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/manager/addVehicle.png)
- View and manage rental history
![View and manage rental history](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/manager/orders.png)
- Accept/deny comments
![Accept or deny comments](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/manager/comments.png)

### Administrators:
- Create companies and register managers
![Create companies and register managers](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/admin/registerObject.png)
- View and manage all users
![View and manage all users](https://github.com/MilenaM06/Rent-A-Car-App/blob/main/preview/final_pages/admin/userProfiles.png)

## Technologies
- **Backend:** JAX-RS REST
- **Frontend:** Vue.js

## Setup

To set up the project in Eclipse, follow these steps:

1. Ensure you have **Eclipse IDE for Java and Web Developers** installed.

2. Configure the Apache server port (default 8080 may conflict):
    - Navigate to `Apache folder -> conf -> server.xml`.
    - Locate the `<Connector port="8080">` line and change it to another port, e.g., `8001`:
      ```xml
      <Connector port="8001" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
      ```

3. Configure the server in Eclipse:
    - Go to **Window -> Preferences -> Server -> Runtime Environments**.
    - Click **Add**, select **Apache -> Apache Tomcat v9.0**, and click **Next**.
    - Browse to the location of your Apache folder and click **Finish**.

4. Verify the **JRE System Library** configuration:
    - Right-click on the project -> **Build Path** -> **Configure Build Path**.
    - In the **Java Build Path** window, go to the **Order and Export** tab.
    - Check if there is an **[unbound]** entry next to **JRE System Library**. If so, click the **Libraries** tab and **Add Library**, then select **JRE System Library** and choose the desired JRE version.

5. Running your project:
    - Right-click on the project -> **Run As -> Run on Server**.

## Authors
- [**Miljana Marjanović, RA 123/2020**](https://github.com/MiljanaMa)
- [**Milena Marković, RA 83/2020**](https://github.com/MilenaM06)
