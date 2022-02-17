import { react, useState, useEffect } from "react";
import styles from "./index.module.scss";

const index = () => {
  // set variables
  const [timeLinePreLoaded, setTimeLinePreLoaded] = useState([]);
  const [timeLineFinalObject, setTimeLineFinalObject] = useState([]);
  const [timeLineStatus, setTimeLineStatus] = useState({
    lastItemChecked: null,
    lastIndexChecked: null,
    lastGeneralIndexChecked: null,
  });

  const dataBaseObject = [
    {
      id: "1",
      title: "Title 1",
      stages: [
        "BRIEF IS ACCEPTED",
        "CONFIGURING SUPPLY CHAIN",
        "SUPPLY CHAIN HAS BEEN CONFIGURED",
        "CHEMIST RECEIVES BRIEF",
      ],
      timeInDays: "1 Day",
    },
    {
      id: "2",
      title: "Title 2",
      stages: ["CHEMIST REVIEWS BRIEF AND CREATES PAPER FORMULA"],
      timeInDays: "1 Day",
    },
    {
      id: "3",
      title: "Title 3",
      stages: ["ORDERING RAW MATERIALS"],
      timeInDays: "7 - 30 DAYS",
    },
    {
      id: "4",
      title: "Title 4",
      stages: [
        "RAW MATERIALS ARRIVE",
        "QC BEGINS ON CUSTOM SAMPLES",
        "QC COMPLETE ON CUSTOMER SAMPLES",
        "CUSTOM SAMPLES SHIPPED",
      ],
      timeInDays: "1 DAY",
    },
    {
      id: "5",
      title: "Title 5",
      stages: ["FIRST FORMULATION SAMPLE BEGINS"],
      timeInDays: "1 DAY",
    },
    {
      id: "6",
      title: "Title 6",
      stages: ["FIRST FORMULATION IS COMPLETED"],
      timeInDays: "1 DAY",
    },
    {
      id: "7",
      title: "Title 7",
      stages: ["FIRST SAMPLE SHIPPED TO ATELIER"],
      timeInDays: "3 - 5 DAYS",
    },
    {
      id: "8",
      title: "Title 9",
      stages: ["ATELIER RECEIVES FIRST SAMPLE - QCS, TEST AND SHIPS"],
      timeInDays: "1 DAY",
    },
    {
      id: "9",
      title: "Title 9",
      stages: ["YOU RECEIVE, TEST, AND PROVIDE FEEDBACK"],
      timeInDays: "7 DAYS",
    },
    {
      id: "10",
      title: "Title 10",
      stages: ["CHEMIST RECEIVES FEEDBACK AND ADJUST FORMULATION IF NECESSARY"],
      timeInDays: "1 DAY",
    },
  ];

  useEffect(() => {
    loadTimeLineInfo();
  }, []);

  useEffect(() => {
    dataConsolitation();
  }, [timeLinePreLoaded, timeLineStatus]);

  useEffect(() => {
    console.log("timeLineFinalObject", timeLineFinalObject);
  }, [timeLineFinalObject]);

  const dataConsolitation = () => {
    const dataBaseObjectCopy = [...timeLinePreLoaded];
    if (dataBaseObjectCopy.length > 0) {
      if (timeLineStatus.lastItemChecked) {
        console.log("lastItemChecked: ", timeLineStatus.lastItemChecked);
        dataBaseObjectCopy.map((event) => {
          event.stages.map((stage, index) => {
            if (stage.generalIndex <= timeLineStatus.lastGeneralIndexChecked) {
              event.stages[index].status = "DONE";
            } else {
              if (
                stage.generalIndex ===
                timeLineStatus.lastGeneralIndexChecked + 1
              ) {
                event.stages[index].status = "IN_PROGRESS";
              } else {
                event.stages[index].status = "NOT_DONE";
              }
            }
          });
        });
      } else {
        dataBaseObjectCopy[0].stages[0].status = "NOT_DONE";
      }
    }
    setTimeLineFinalObject(dataBaseObjectCopy);
  };

  const loadTimeLineInfo = () => {
    const dataBaseObjectCopy = [...dataBaseObject];
    let incrementalIndex = 0;
    dataBaseObjectCopy.map((item) => {
      item.stages.map((stage, index) => {
        incrementalIndex += 1;
        item.stages[index] = {
          name: stage,
          delayInDays: null,
          generalIndex: incrementalIndex,
          status: "NOT_DONE",
        };
      });
    });
    console.log("dataBaseObjectCopy", dataBaseObjectCopy);
    setTimeLinePreLoaded(dataBaseObjectCopy);
    setTimeLineFinalObject(dataBaseObjectCopy);
  };

  const handleClick = (mainId, index, generalIndex) => {
    const timeLineStatusCopy = { ...timeLineStatus };
    timeLineStatusCopy.lastItemChecked = mainId;
    timeLineStatusCopy.lastIndexChecked = index;
    timeLineStatusCopy.lastGeneralIndexChecked = generalIndex;
    setTimeLineStatus(timeLineStatusCopy);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={`${styles.generalContainer}`}>
        <TagAndTitle
          title="Product 1.0"
          mainTitle={styles.mainTitle}
          isLastChecked={timeLineStatus.lastItemChecked ? false : true}
        />
      </div>
      {timeLineFinalObject.length > 0 &&
        timeLineFinalObject?.map((item, mainIndex) => {
          return (
            <div className={styles.subContainer}>
              <div>
                {item.stages.map((stageItem, index) => {
                  return (
                    <div className={styles.generalContainer}>
                      <NormalItemTimeLine
                        title={stageItem.name}
                        handleClick={handleClick}
                        mainId={item.id}
                        index={index}
                        generalIndex={stageItem.generalIndex}
                        done={stageItem.status === "DONE" ? styles.done : ""}
                        notDone={
                          stageItem.status === "NOT_DONE" ? styles.notDone : ""
                        }
                        inProgress={
                          stageItem.status === "IN_PROGRESS"
                            ? styles.inProgress
                            : ""
                        }
                        isLastChecked={
                          stageItem.generalIndex ===
                            timeLineStatus.lastGeneralIndexChecked &&
                          index < item.stages.length - 1
                            ? true
                            : false
                        }
                        selectable={
                          stageItem.status === "IN_PROGRESS" ||
                          stageItem.generalIndex === index - 1
                            ? styles.selectable
                            : null
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div
                className={`${styles.generalContainer} ${
                  mainIndex === timeLineFinalObject.length - 1
                    ? styles.noLine
                    : null
                }`}
              >
                <TagAndTitle
                  title={item.timeInDays}
                  isLastChecked={
                    mainIndex < timeLineFinalObject.length - 1 &&
                    item.id === timeLineStatus.lastItemChecked &&
                    timeLineStatus.lastIndexChecked === item.stages.length - 1
                      ? true
                      : false
                  }
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default index;

const TagAndTitle = (props) => {
  const { title, mainTitle, isLastChecked } = props;
  return (
    <div className={`${styles.itemTimelineBox}`}>
      <div className={`${styles.itemTitleAndTag} ${mainTitle}`}>{title}</div>
      {isLastChecked && <div className={styles.pulseTag}></div>}
    </div>
  );
};

const NormalItemTimeLine = (props) => {
  const {
    title,
    handleClick,
    mainId,
    index,
    generalIndex,
    done,
    isLastChecked = false,
    selectable = null,
  } = props;
  return (
    <div
      className={`${styles.itemTimelineBox}`}
      onClick={() =>
        selectable ? handleClick(mainId, index, generalIndex) : null
      }
    >
      <div className={`${styles.eventStageTitle} ${done} ${selectable}`}>
        {title}
      </div>
      <div className={`${styles.clickArea} ${done} ${selectable}`}></div>
      {isLastChecked && <div className={styles.pulse}></div>}
    </div>
  );
};
