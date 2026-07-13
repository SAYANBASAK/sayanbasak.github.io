# Free Hosting Guide - StationMadad Howrah

This folder is ready for free static hosting.

## Best Free Options

### Option 1: Netlify Drop - easiest

1. Open <https://app.netlify.com/drop>
2. Drag and drop the full `station-madad-howrah` folder.
3. Netlify will create a free public website link.

### Option 2: GitHub Pages

1. Create a free GitHub account.
2. Create a new public repository, for example `station-madad-howrah`.
3. Upload all files from this folder into the repository.
4. Go to repository `Settings`.
5. Open `Pages`.
6. Under `Build and deployment`, select:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
7. Save.
8. GitHub will publish the site at:
   `https://YOUR-USERNAME.github.io/station-madad-howrah/`

### Option 3: Cloudflare Pages

1. Create a free Cloudflare account.
2. Open `Workers & Pages`.
3. Create Pages project.
4. Upload this folder or connect a GitHub repository.
5. No build command is required.

## Important Limitation

This portable/free static version stores complaints and users in browser `localStorage`.
That means:

- Data entered on one computer is not automatically visible on another computer.
- Clearing browser data may remove local records.
- It is suitable as a prototype/demo.

For real divisional use, connect a backend database such as Firebase or Supabase.

## Google Sheet Database Setup

The app includes `google-sheets-apps-script.gs` for this sheet:

`https://docs.google.com/spreadsheets/d/1y24ay-NDtFASf_JcVLf9HwSFcr2y0tavI8YMx57OzU4/edit`

Steps:

1. Open the Google Sheet.
2. Go to `Extensions` > `Apps Script`.
3. Delete any sample code.
4. Paste the full contents of `google-sheets-apps-script.gs`.
5. Click `Save`.
6. Click `Deploy` > `New deployment`.
7. Select type: `Web app`.
8. Execute as: `Me`.
9. Who has access: `Anyone`.
10. Click `Deploy` and allow permissions.
11. Copy the Web App URL.
12. Login to StationMadad as Super User.
13. Open `User Control`.
14. Paste the Web App URL under `Google Sheet database`.
15. Click `Save Google Sheet sync URL`.
16. Click `Test sync latest complaint`.

After this, new complaints and complaint updates will be sent to the Google Sheet.

The script automatically creates a new tab for each complaint date, for example `07-Jul-2026`, using the same header format every day. It also keeps an `All Complaints` summary tab.

Rectification images uploaded during Control/BO action are saved to Google Drive by the Apps Script, and the image link is stored in the sheet.
