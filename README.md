# Canvas Rubric

Canvas Rubric returns a CSV with the following headers:
* Student Name
* Student Number
* Section Number
* TA Name
* TA Student Number
* Total grade on assignment
* Link to download assignment submission
* Each individual component of the rubric (grade and comments)
* Overall comments made by TA/Instructor only (student comments are filtered out)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for use with your own API tokens and Canvas domains.

### Prerequisites

1. **Install [Node 8.0.0 or greater](https://nodejs.org)**.
2. **Install [Git](https://git-scm.com/downloads)**.

### Installation

1. Clone this repo. `git clone https://github.com/ubccapico/canvas-rubric.git`
1. Then cd into the repo. `cd canvas-rubric`
1. Run the installation script. `npm install` (If you see `babel-node: command not found`, you've missed this step.)
1. Call `getRubric` in `index.js` with `courseId`, `assignmentId`, and `rubricId`. `getRubric` returns a promise that resolves to an object that can be passed to `writeToCSV` to write it out.

### Host URL and Token setup
1. Create a `.env` file.
1. Add the following: `CANVAS_API_TOKEN={YOUR API TOKEN}` and `CANVAS_API_DOMAIN={YOUR API DOMAIN}`.

An example `CANVAS_API_DOMAIN` is `https://{school}.instructure.com/api/v1`


### Example usage (written at end of index.js)

```javascript
getRubric(/* course id */ 123, /* assignment id */ 456, /* rubric id */ 789)
  .then(data => writeToCSV(data))
```

This should output a CSV named `output.csv` in the `canvas-rubric` folder.

## Authors

* **Justin Lee**
https://github.com/justin0022 | justin.lee@ubc.ca

## License

This project is licensed under the GNU General Public License v3.0.
