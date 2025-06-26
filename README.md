# TigerPool

### To run this application on a local Mac or Linux computer with the launch.sh script, execute the following:

1.  Activate the virtual environment with the needed requirements, as specified in [`setup_instructions`](./setup_instructions).

2.  Run the `launch.sh` script from the `/TigerPool` directory to run the application at the input port:

        > bash launch.sh |someport|

    This will set an `APP_SECRET_KEY` environment variable to the value `"testing"`.

3.  Finally, browse to the application at http://localhost:|someport|. (You must use "localhost" as the host. Using the real IP address of your computer won't work. Using 127.0.0.1 won't work.)

---

### To run this application on a local Mac, Linux, or MS Windows computer without the launch.sh script, execute the following:

1.  Activate the virtual environment with the needed requirements, as specified in [`setup_instructions`](./setup_instructions).

2.  Create an `APP_SECRET_KEY` environment variable (it would be common to define `APP_SECRET_KEY` in a `.env` file). For Mac and Linux, use the following command:

        > export APP_SECRET_KEY=|somesecretkey|

    For Windows, use the following command:

        > set APP_SECRET_KEY=|somesecretkey|

3.  Install required node modules in the `/Frontend` directory:

        > npm install

4.  Build the JavaScript bundle in the `/Frontend` directory:

        > npm run build

5.  Run the test server in the `/Server` directory:

        > python runserver.py |someport|

6.  Finally, browse to the application at http://localhost:|someport|. (You must use "localhost" as the host. Using the real IP address of your computer won't work. Using 127.0.0.1 won't work.)

---

### To run this application on Render:

1. Deploy the application to Render as usual.

2. Configure the application such that it has an environment variable
   whose name is APP_SECRET_KEY and whose value is some secret key.

3. Ask OIT to place your Render app (as identified by its URL) on
   the Princeton CAS white list. The COS 333 "Princeton Data Sources"
   web page describes how to do that.

4. Browse to the application at https:// **|yourappname|** .onrender.com .
