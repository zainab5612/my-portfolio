// app/clean/content.ts
export type CleanKey = "conceptualize" | "locate" | "evaluate" | "augment" | "note";
export type CleanItem = { title: string; summary: string; screenshot: string; link: string };

export const CLEAN_CONTENT: Record<CleanKey, CleanItem[]> = {
  conceptualize: [
    {
      title: "Education Analysis",
      summary:
        "Defined the objective: identify key factors influencing student performance. Explored dataset structure using df.head() and df.info().",
      screenshot: "/CON_EDU.png",
      link: "https://github.com/zainab5612/Student-Performance-Analytics/blob/main/EDU-Data.ipynb",
    },
    {
      title: "Breast Cancer Prediction",
      summary:
        "Objective: build a classifier to predict tumor diagnosis (benign vs malignant). Identified 'diagnosis' as the target variable.",
      screenshot: "/C_BRSC.png",
      link: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-/blob/main/machine_learning.ipynb",
    },
    {
      title: "Netflix Content Analysis",
      summary:
        "Goal: analyze Netflix content trends by year, genre, and rating. Converted date_added to year_added for time-based analysis.",
      screenshot: "/C_NET.png",
      link: "https://github.com/zainab5612/Netflix-project/blob/main/netflix.ipynb",
    },
    {
      title: "Salary Analysis",
      summary:
        "Objective: explore global tech salaries and predict compensation based on role, experience, and country.",
      screenshot: "/C_SAL.png",
      link: "https://github.com/zainab5612/salary-data-analysis/blob/main/salaries.ipynb",
    },
  ],
  locate: [
    {
      title: "Education Analysis",
      summary:
        "Cleaned null values, encoded categorical features such as gender and parental education. Normalized numeric scores.",
      screenshot: "/L_EDU.png",
      link: "https://github.com/zainab5612/Student-Performance-Analytics/blob/main/EDU-Data.ipynb",
    },
    {
      title: "Breast Cancer Prediction",
      summary:
        "Applied label encoding, standardized numeric variables, and dropped irrelevant identifiers.",
      screenshot: "/L_BRSC.png",
      link: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-/blob/main/machine_learning.ipynb",
    },
    {
      title: "Netflix Content Analysis",
      summary:
        "Filled missing values for director, rating, and country. Dropped 'cast' and normalized categories.",
      screenshot: "/L_NET.png",
      link: "https://github.com/zainab5612/Netflix-project/blob/main/netflix.ipynb",
    },
    {
      title: "Salary Analysis",
      summary:
        "Handled missing salary entries; converted categoricals with get_dummies().",
      screenshot: "/L_SAL.png",
      link: "https://github.com/zainab5612/salary-data-analysis/blob/main/salaries.ipynb",
    },
  ],
  evaluate: [
    {
      title: "Education Analysis",
      summary:
        "Acknowledged bias and noise in self-reported survey data; some lifestyle data points were imprecise.",
      screenshot: "/E_EDU.png",
      link: "https://github.com/zainab5612/Student-Performance-Analytics/blob/main/EDU-Data.ipynb",
    },
    {
      title: "Breast Cancer Prediction",
      summary:
        "Recognized class imbalance with fewer malignant cases; documented as a limitation.",
      screenshot: "/E_BRSC.png",
      link: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-/blob/main/machine_learning.ipynb",
    },
    {
      title: "Netflix Content Analysis",
      summary:
        "date_added incomplete; fallback on release_year. Country metadata inconsistent.",
      screenshot: "/E_NET.png",
      link: "https://github.com/zainab5612/Netflix-project/blob/main/netflix.ipynb",
    },
    {
      title: "Salary Analysis",
      summary:
        "Job titles highly fragmented → noisy categories; documented as a limitation.",
      screenshot: "/E_SAL.png",
      link: "https://github.com/zainab5612/salary-data-analysis/blob/main/salaries.ipynb",
    },
  ],
  augment: [
    {
      title: "Education Analysis",
      summary:
        "Created new features (averages, pass/fail). Visualized study time vs performance. Built logistic regression models.",
      screenshot: "/A_EDU.png",
      link: "https://github.com/zainab5612/Student-Performance-Analytics/blob/main/EDU-Data.ipynb",
    },
    {
      title: "Breast Cancer Prediction",
      summary:
        "Implemented Logistic Regression and Random Forest; used correlation heatmap to reduce multicollinearity.",
      screenshot: "/A_BRSC.png",
      link: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-/blob/main/machine_learning.ipynb",
    },
    {
      title: "Netflix Content Analysis",
      summary:
        "Pivot tables for Movies vs TV by year. Built Power BI dashboards (line, bar, geo maps).",
      screenshot: "/A_NET.png",
      link: "https://github.com/zainab5612/Netflix-project/blob/main/netflix.ipynb",
    },
    {
      title: "Salary Analysis",
      summary:
        "Explored salary distributions (histograms, boxplots). Built regression models to predict salaries.",
      screenshot: "/A_SAL.png",
      link: "https://github.com/zainab5612/salary-data-analysis/blob/main/salaries.ipynb",
    },
  ],
  note: [
    {
      title: "Education Analysis",
      summary:
        "Documented preprocessing with markdown/comments; exported cleaned datasets for reproducibility.",
      screenshot: "/N_EDU.png",
      link: "https://github.com/zainab5612/Student-Performance-Analytics/blob/main/EDU-Data.ipynb",
    },
    {
      title: "Breast Cancer Prediction",
      summary:
        "Saved confusion matrix & classification reports; noted accuracy vs recall trade-offs.",
      screenshot: "/N_BRSC.png",
      link: "https://github.com/zainab5612/Breast-Cancer-Prediction-Logistic-Regression-/blob/main/machine_learning.ipynb",
    },
    {
      title: "Netflix Content Analysis",
      summary:
        "Commented cleaning steps; exported CSV; documented dashboard annotations; cited Kaggle source.",
      screenshot: "/N_NET.png",
      link: "https://github.com/zainab5612/Netflix-project/blob/main/netflix.ipynb",
    },
    {
      title: "Salary Analysis",
      summary:
        "Recorded assumptions (outliers, normalization); exported processed dataset and summaries.",
      screenshot: "/N_SAL.png",
      link: "https://github.com/zainab5612/salary-data-analysis/blob/main/salaries.ipynb",
    },
  ],
};
