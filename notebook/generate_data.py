# notebook/generate_data.py
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans

def generate_students(n=500, seed=42):
    np.random.seed(seed)
    student_id = np.arange(1, n+1)
    names = [f"Student_{i:03d}" for i in student_id]
    classes = np.random.choice(['A','B','C','D'], size=n)

    comprehension = np.clip(np.random.normal(70, 12, n), 20, 100)
    attention = np.clip(np.random.normal(65, 15, n), 10, 100)
    focus = np.clip(np.random.normal(68, 14, n), 10, 100)
    retention = np.clip(np.random.normal(66, 13, n), 10, 100)
    engagement_time = np.clip(np.random.normal(45, 20, n), 0, 180)

    assessment_score = (
        0.30*comprehension + 0.25*attention + 0.20*focus + 0.15*retention +
        0.10*(engagement_time/2) + np.random.normal(0, 6, n)
    )
    assessment_score = np.clip(assessment_score, 0, 100)

    df = pd.DataFrame({
        'student_id': student_id,
        'name': names,
        'class': classes,
        'comprehension': np.round(comprehension,1),
        'attention': np.round(attention,1),
        'focus': np.round(focus,1),
        'retention': np.round(retention,1),
        'engagement_time': np.round(engagement_time,1),
        'assessment_score': np.round(assessment_score,1)
    })

    # cluster into personas
    features = ['comprehension','attention','focus','retention','engagement_time']
    sc = StandardScaler()
    X_s = sc.fit_transform(df[features])

    kmeans = KMeans(n_clusters=4, random_state=seed)
    df['cluster'] = kmeans.fit_predict(X_s)

    persona_map = {
        0: 'Engaged High Achiever',
        1: 'Needs Attention',
        2: 'Steady Learner',
        3: 'Distracted Low Engagement'
    }
    df['persona'] = df['cluster'].map(persona_map)

    return df

if __name__ == "__main__":
    df = generate_students(n=500, seed=42)
    df.to_csv('notebook/synthetic_students.csv', index=False)
    df.to_json('notebook/students_with_persona.json', orient='records', indent=2)
    df.to_json('notebook/students.json', orient='records', indent=2)
    print("Saved notebook/synthetic_students.csv and students_with_persona.json")
