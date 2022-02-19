import { react, useState, useEffect } from 'react';
import styles from './index.module.scss';

const index = () => {
  // set variables
  const [timeLinePreLoaded, setTimeLinePreLoaded] = useState([]);
  const [timeLineFinalObject, setTimeLineFinalObject] = useState([]);
  const [totalGeneralIndex, setTotalGeneralIndex] = useState(0);
  const [willSetDelay, setWillSetDelay] = useState(false);
  const [timeLineStatus, setTimeLineStatus] = useState({
    lastItemChecked: null,
    lastIndexChecked: null,
    lastGeneralIndexChecked: null,
  });

  const dataBaseObject = [
    {
      id: '1',
      title: 'Title 1',
      stages: [
        'BRIEF IS ACCEPTED',
        'CONFIGURING SUPPLY CHAIN',
        'SUPPLY CHAIN HAS BEEN CONFIGURED',
        'CHEMIST RECEIVES BRIEF',
      ],
      timeInDays: '1 Day',
    },
    {
      id: '2',
      title: 'Title 2',
      stages: ['CHEMIST REVIEWS BRIEF AND CREATES PAPER FORMULA'],
      timeInDays: '1 Day',
    },
    {
      id: '3',
      title: 'Title 3',
      stages: ['ORDERING RAW MATERIALS'],
      timeInDays: '7 - 30 DAYS',
    },
    {
      id: '4',
      title: 'Title 4',
      stages: [
        'RAW MATERIALS ARRIVE',
        'QC BEGINS ON CUSTOM SAMPLES',
        'QC COMPLETE ON CUSTOMER SAMPLES',
        'CUSTOM SAMPLES SHIPPED',
      ],
      timeInDays: '1 DAY',
    },
    {
      id: '5',
      title: 'Title 5',
      stages: ['FIRST FORMULATION SAMPLE BEGINS'],
      timeInDays: '1 DAY',
    },
    {
      id: '6',
      title: 'Title 6',
      stages: ['FIRST FORMULATION IS COMPLETED'],
      timeInDays: '1 DAY',
    },
    {
      id: '7',
      title: 'Title 7',
      stages: ['FIRST SAMPLE SHIPPED TO ATELIER'],
      timeInDays: '3 - 5 DAYS',
    },
    {
      id: '8',
      title: 'Title 9',
      stages: ['ATELIER RECEIVES FIRST SAMPLE - QCS, TEST AND SHIPS'],
      timeInDays: '1 DAY',
    },
    {
      id: '9',
      title: 'Title 9',
      stages: ['YOU RECEIVE, TEST, AND PROVIDE FEEDBACK'],
      timeInDays: '7 DAYS',
    },
    {
      id: '10',
      title: 'Title 10',
      stages: ['CHEMIST RECEIVES FEEDBACK AND ADJUST FORMULATION IF NECESSARY'],
      timeInDays: '1 DAY',
    },
  ];

  useEffect(() => {
    loadTimeLineInfo();
  }, []);

  useEffect(() => {
    dataConsolitation();
  }, [timeLinePreLoaded, timeLineStatus]);

  const dataConsolitation = () => {
    const dataBaseObjectCopy = [...timeLinePreLoaded];
    if (dataBaseObjectCopy.length > 0) {
      if (timeLineStatus.lastItemChecked) {
        dataBaseObjectCopy.map((event) => {
          let mainStatus = styles.done;
          event.stages.map((stage, index) => {
            let selectable = styles.selectable;
            event.stages[index].selectable = null;
            if (stage.generalIndex <= timeLineStatus.lastGeneralIndexChecked) {
              event.stages[index].status = 'DONE';
              event.stages[index].styleStatus = styles.done;
              if (
                stage.generalIndex === timeLineStatus.lastGeneralIndexChecked
              ) {
                event.stages[index].selectable = selectable;
              }
            } else {
              mainStatus = null;
              if (
                stage.generalIndex ===
                timeLineStatus.lastGeneralIndexChecked + 1
              ) {
                event.stages[index].status = 'IN_PROGRESS';
                event.stages[index].selectable = selectable;
                event.stages[index].styleStatus = styles.inProgress;
              } else {
                event.stages[index].status = 'NOT_DONE';
                event.stages[index].styleStatus = styles.notDone;
              }
            }
          });
          event.mainStatus = mainStatus;
        });
      } else {
        dataBaseObjectCopy.map((event, mainIndex) => {
          event.stages.map((stage, index) => {
            if (mainIndex === 0 && index === 0) {
              event.stages[index].status = 'IN_PROGRESS';
              event.stages[index].styleStatus = styles.inProgress;
              event.stages[index].selectable = styles.selectable;
            } else {
              event.stages[index].status = 'NOT_DONE';
              event.stages[index].styleStatus = styles.notDone;
              event.stages[index].selectable = null;
            }
          });
        });
      }
    }
    setTimeLineFinalObject(dataBaseObjectCopy);
  };

  const loadTimeLineInfo = () => {
    const dataBaseObjectCopy = [...dataBaseObject];
    let incrementalIndex = 0;
    dataBaseObjectCopy.map((item, mainIndex) => {
      let previousMainId = null;
      let previousIndex = null;
      item.stages.map((stage, index) => {
        previousMainId = item.id;
        previousIndex = index - 1;
        if (index === 0) {
          previousMainId = dataBaseObjectCopy[mainIndex - 1]?.id;
          previousIndex = dataBaseObjectCopy[mainIndex - 1]?.stages.length - 1;
        }
        incrementalIndex += 1;
        item.stages[index] = {
          name: stage,
          delayInDays: null,
          generalIndex: incrementalIndex,
          status: 'NOT_DONE',
          selectable: null,
          styleStatus: null,
          previousMainId: previousMainId,
          previousIndex: previousIndex,
        };
      });
    });
    setTotalGeneralIndex(incrementalIndex);
    console.log('dataBaseObjectCopy', dataBaseObjectCopy);
    setTimeLinePreLoaded(dataBaseObjectCopy);
    setTimeLineFinalObject(dataBaseObjectCopy);
  };

  const handleClick = (
    previousMainId,
    mainId,
    previousIndex,
    index,
    generalIndex
  ) => {
    const timeLineStatusCopy = { ...timeLineStatus };
    if (timeLineStatusCopy.lastGeneralIndexChecked === generalIndex) {
      timeLineStatusCopy.lastItemChecked = previousMainId;
      timeLineStatusCopy.lastIndexChecked = previousIndex;
      timeLineStatusCopy.lastGeneralIndexChecked = generalIndex - 1;
    } else {
      timeLineStatusCopy.lastItemChecked = mainId;
      timeLineStatusCopy.lastIndexChecked = index;
      timeLineStatusCopy.lastGeneralIndexChecked = generalIndex;
    }
    setTimeLineStatus(timeLineStatusCopy);
  };

  const meanageSetDelay = () => {
    console.log('xx');
    setWillSetDelay(!willSetDelay);
  };

  useEffect(() => {
    console.log('willSetDelay:', willSetDelay);
  }, [willSetDelay]);

  return (
    <div className={styles.fullContainer}>
      <div className={styles.leftPainel}>
        <div className={styles.setDelayBox}>
          <div className="">Selected:{willSetDelay ? 'true' : 'false'}</div>
          <div className={styles.buttom}>Save</div>
          <div className={styles.buttom} onClick={() => meanageSetDelay()}>
            Set Delay
          </div>
        </div>
      </div>
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
                          previousMainId={stageItem.previousMainId}
                          previousIndex={stageItem.previousIndex}
                          mainId={item.id}
                          index={index}
                          generalIndex={stageItem.generalIndex}
                          styleStatus={stageItem.styleStatus}
                          isLastChecked={
                            stageItem.generalIndex ===
                              timeLineStatus.lastGeneralIndexChecked &&
                            index < item.stages.length - 1
                              ? true
                              : false
                          }
                          selectable={stageItem.selectable}
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
                    styleStatus={item.mainStatus}
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
    </div>
  );
};

export default index;

const TagAndTitle = (props) => {
  const { title, mainTitle, isLastChecked, styleStatus } = props;
  return (
    <div className={`${styles.itemTimelineBox}`}>
      <div className={`${styles.itemTitleAndTag} ${mainTitle} ${styleStatus}`}>
        {title}
      </div>
      {isLastChecked && <div className={styles.pulseTag}></div>}
    </div>
  );
};

const NormalItemTimeLine = (props) => {
  const {
    title,
    handleClick,
    previousMainId,
    mainId,
    previousIndex,
    index,
    generalIndex,
    styleStatus,
    isLastChecked = false,
    selectable = null,
  } = props;
  return (
    <div
      className={`${styles.itemTimelineBox}`}
      onClick={() =>
        selectable
          ? handleClick(
              previousMainId,
              mainId,
              previousIndex,
              index,
              generalIndex
            )
          : null
      }
    >
      <div className={`${styles.eventStageTitle} ${styleStatus} ${selectable}`}>
        {title}
      </div>
      <div className={`${styles.clickArea} ${styleStatus} ${selectable}`}></div>
      {isLastChecked && <div className={styles.pulse}></div>}
    </div>
  );
};
