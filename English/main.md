<!--
教师：张洁
邮箱：mail:gailzhang@sina.com
-->

医学英语
========
## 大病历
### 问诊

```mermaid
sequenceDiagram
    participant Doctor
    participant Patient
    Doctor->>Patient: What's the matter?
    Patient-->>Doctor: [Cough] Every time I breath, there will be an acute pain in my chest.
    Note right of Patient: Pointing to the right frontal area of his chest
    Doctor->>Patient: Can I have a look at your phlagm?
    Patient-->>Doctor: Sure. [Cough] [Cough]
    Doctor->>Patient: Are you feeling better or worse after coughing?
    Patient-->>Doctor: Well, neither. But it will be worse when I get up in the morning.
    Doctor->>Patient: OK. When did the symptom start?
    Patient-->>Doctor: About 5 days ago after I was caught in a heavy rain.
    Patient-->>Doctor: I thought it was an influenza [Cough]
    Patient-->>Doctor: and have been taking some aspirin for 3 days,
    Patient-->>Doctor: but it doesn't seems to have any effect.
    Doctor->>Patient: Well, did you have any diseases related to heart or lung?
    Patient-->>Doctor: None, other than hypertension diagnosed in 1997.
    Doctor->>Patient: OK. Let's have a physical exam.
```

### 病例报告

```
Name                        XXX
Gender                      Male
Age                         53 y/o
Chief complaints            5 days of acute chest pain when breathing
History of Present Illness  The patient complains about 5 days of acute pain in the right frontal
                            area of chest when breathing. Symptoms get worse in the morning.
                            Aspirin is taken 2 days after chest pain for 3 days, while no relief.
                            Rusty expectoration is observed. Besides, A positive Pleural friction
                            sign is observed during physical examination.
Past Medical History        HPT for 21 years
Allergy                     None
```
## Respiratory System
```mermaid
graph TD
  subgraph upperRT
    nose --> pharynx
    pharynx --> larynx
  end

  subgraph lowerRT
    trachea --> bronchi
    bronchi --> bronchiole
    bronchiole --> alveoli
  end

  larynx --> trachea

  subgraph functions
    t((transport))
    f((filter))

    nf("coarse hairs; cilia; mucus") --- f
    pf("mucus; cilia; tonsils") --- f
    lf("mucus") --- f
    af("mucus; cilia; macrophage") --- f

    nose --> t
    nose --> nf
    nose --> nw("warm(capiliary)")
    nw --- nm
    nm("moisten(mucous; membrane)")

    pharynx --> t
    pharynx --> pf

    larynx --> t
    larynx --> lf
    larynx --> lpc("prevent choking")
    lpc --- lps
    lps("produce sound")

    trachea --> t
    trachea --> f
    bronchi --> t
    bronchi --> f
    bronchiole --> t
    bronchiole --> f

    alveoli --> af

    nf -.- pf
    pf -.- lf
    t -.- f
    f -.- nw
    nm -.- lpc
  end

  linkStyle 27 stroke:#ffffff00,stroke-width:0;
  linkStyle 28 stroke:#ffffff00,stroke-width:0;
  linkStyle 29 stroke:#ffffff00,stroke-width:0;
  linkStyle 30 stroke:#ffffff00,stroke-width:0;
  linkStyle 31 stroke:#ffffff00,stroke-width:0;
```

## Cardiovascular System
### Cardiac cycle
```mermaid
gantt
    title Cardiac cycle
    dateFormat SS
    section Ventricular
    Ventricular Diastole:vd, 00, 1s
    Ventricular Systole:active, vs, after vd, 3s
    Ventricular Diastole:after vs, 4s
    section Atrial
    Atral Systole:active, as, 00, 2s
    Atral Diastole:after as, 6s
```
