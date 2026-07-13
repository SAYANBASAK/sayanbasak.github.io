# StationMadad Howrah Division Prototype

Open `index.html` in a browser to run the prototype. Data is stored in browser localStorage.

## Demo users

- Station Manager: `smhwh` / `howrah123`
- Traffic Inspector: `tihwh` / `ti123`
- Departmental Control Office: `enggcontrol` / `control123`
- Branch Officer: `boengg` / `bo123`
- Divisional Admin: `adminhwh` / `admin123`
- Super User: `superhwh` / `super123`

## Included workflow

- Station managers raise station complaints to a specific department.
- Department users view and update department-wise issues.
- Admin users see the full divisional complaint register.
- Complaints include station, department, location, category, priority, attachment name, status, due date, and action history.
- Complaint date/time and submission timestamp are recorded.
- Complaint resolution/action updates are restricted to Departmental Control and Branch Officer users.
- Control/BO users can upload rectification images while updating complaint status.
- Reports can be exported as CSV or printed.
- Super User can create, save, import, edit, and delete user IDs/passwords/phone numbers.
- Google Sheet sync is supported through `google-sheets-apps-script.gs`.

## User upload format

Use Excel to prepare a CSV/TSV file with these columns:

`username,password,name,role,station,stations,department,phone`

Roles accepted: `station-manager`, `supervisor`, `control`, `bo`, `department`, `admin`, `super`.

For supervisor IDs, put multiple stations in the `stations` column separated by semicolon, for example:

`HWH - HOWRAH; BDC - BANDEL; BWN - BARDHAMAN`

For offline portability, native `.xlsx` should be saved/exported as CSV before upload.
