// import * as React from "react";
// import {
//   ViewState,
//   GroupingState,
//   IntegratedGrouping
// } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   WeekView,
//   DayView,
//   Appointments,
//   Toolbar,
//   DateNavigator,
//   ViewSwitcher,
//   AllDayPanel,
//   AppointmentTooltip,
//   AppointmentForm,
//   GroupingPanel,
//   Resources
// } from "@devexpress/dx-react-scheduler-material-ui";
// import { connectProps } from "@devexpress/dx-react-core";
// import { withStyles, makeStyles, fade } from "@material-ui/core/styles";
// import PriorityHigh from "@material-ui/icons/PriorityHigh";
// import LowPriority from "@material-ui/icons/LowPriority";
// import Lens from "@material-ui/icons/Lens";
// import Event from "@material-ui/icons/Event";
// import AccessTime from "@material-ui/icons/AccessTime";
// import Paper from "@material-ui/core/Paper";
// import MenuItem from "@material-ui/core/MenuItem";
// import Select from "@material-ui/core/Select";
// import Grid from "@material-ui/core/Grid";
// import FormControl from "@material-ui/core/FormControl";
// import classNames from "clsx";

// import { priorities } from "../demo-data/tasks";
// import { data as tasks } from "../demo-data/grouping";

// const grouping = [
//   {
//     resourceName: "priorityId"
//   }
// ];

// const filterTasks = (items, priorityId) =>
//   items.filter(task => !priorityId || task.priorityId === priorityId);

// const getIconById = id => {
//   if (id === 1) {
//     return LowPriority;
//   }
//   if (id === 2) {
//     return Event;
//   }
//   return PriorityHigh;
// };

// const styles = theme => ({
//   flexibleSpace: {
//     margin: "0 auto 0 0"
//   },
//   prioritySelector: {
//     marginLeft: theme.spacing(2),
//     minWidth: 140,
//     "@media (max-width: 500px)": {
//       minWidth: 0,
//       fontSize: "0.75rem",
//       marginLeft: theme.spacing(0.5)
//     }
//   }
// });
// const usePrioritySelectorItemStyles = makeStyles(({ palette, spacing }) => ({
//   bullet: ({ color }) => ({
//     backgroundColor: color ? color[400] : palette.divider,
//     borderRadius: "50%",
//     width: spacing(2),
//     height: spacing(2),
//     marginRight: spacing(2),
//     display: "inline-block"
//   }),
//   prioritySelectorItem: {
//     display: "flex",
//     alignItems: "center"
//   },
//   priorityText: {
//     "@media (max-width: 500px)": {
//       display: "none"
//     }
//   },
//   priorityShortText: {
//     "@media (min-width: 500px)": {
//       display: "none"
//     }
//   }
// }));
// const useTooltipContentStyles = makeStyles(theme => ({
//   content: {
//     padding: theme.spacing(3, 1),
//     paddingTop: 0,
//     backgroundColor: theme.palette.background.paper,
//     boxSizing: "border-box",
//     width: "400px"
//   },
//   contentContainer: {
//     paddingBottom: theme.spacing(1.5)
//   },
//   text: {
//     ...theme.typography.body2,
//     display: "inline-block"
//   },
//   title: {
//     ...theme.typography.h6,
//     color: theme.palette.text.secondary,
//     fontWeight: theme.typography.fontWeightBold,
//     overflow: "hidden",
//     textOverflow: "ellipsis",
//     whiteSpace: "normal"
//   },
//   icon: {
//     verticalAlign: "middle"
//   },
//   contentItemIcon: {
//     textAlign: "center"
//   },
//   grayIcon: {
//     color: theme.palette.action.active
//   },
//   colorfulContent: {
//     color: ({ color }) => color[300]
//   },
//   lens: {
//     width: theme.spacing(4.5),
//     height: theme.spacing(4.5),
//     verticalAlign: "super"
//   },
//   textCenter: {
//     textAlign: "center"
//   },
//   dateAndTitle: {
//     lineHeight: 1.1
//   },
//   titleContainer: {
//     paddingBottom: theme.spacing(2)
//   },
//   container: {
//     paddingBottom: theme.spacing(1.5)
//   }
// }));
// const groupingStyles = ({ spacing }) => ({
//   ...priorities.reduce(
//     (acc, priority) => ({
//       ...acc,
//       [`cell${priority.text.replace(" ", "")}`]: {
//         backgroundColor: fade(priority.color[400], 0.1),
//         "&:hover": {
//           backgroundColor: fade(priority.color[400], 0.15)
//         },
//         "&:focus": {
//           backgroundColor: fade(priority.color[400], 0.2)
//         }
//       },
//       [`headerCell${priority.text.replace(" ", "")}`]: {
//         backgroundColor: fade(priority.color[400], 0.1),
//         "&:hover": {
//           backgroundColor: fade(priority.color[400], 0.1)
//         },
//         "&:focus": {
//           backgroundColor: fade(priority.color[400], 0.1)
//         }
//       }
//     }),
//     {}
//   ),
//   icon: {
//     paddingLeft: spacing(1),
//     verticalAlign: "middle"
//   }
// });

// const DayViewTimeTableCell = withStyles(groupingStyles, {
//   name: "DayViewTimeTableCell"
// })(({ groupingInfo, classes, ...restProps }) => {
//   const groupId = groupingInfo[0].id;
//   return (
//     <DayView.TimeTableCell
//       className={classNames({
//         [classes.cellLowPriority]: groupId === 1,
//         [classes.cellMediumPriority]: groupId === 2,
//         [classes.cellHighPriority]: groupId === 3
//       })}
//       groupingInfo={groupingInfo}
//       {...restProps}
//     />
//   );
// });
// const DayViewDayScaleCell = withStyles(groupingStyles, {
//   name: "DayViewDayScaleCell"
// })(({ groupingInfo, classes, ...restProps }) => {
//   const groupId = groupingInfo[0].id;
//   return (
//     <DayView.DayScaleCell
//       className={classNames({
//         [classes.headerCellLowPriority]: groupId === 1,
//         [classes.headerCellMediumPriority]: groupId === 2,
//         [classes.headerCellHighPriority]: groupId === 3
//       })}
//       groupingInfo={groupingInfo}
//       {...restProps}
//     />
//   );
// });
// const WeekViewTimeTableCell = withStyles(groupingStyles, {
//   name: "WeekViewTimeTableCell"
// })(({ groupingInfo, classes, ...restProps }) => {
//   const groupId = groupingInfo[0].id;
//   return (
//     <WeekView.TimeTableCell
//       className={classNames({
//         [classes.cellLowPriority]: groupId === 1,
//         [classes.cellMediumPriority]: groupId === 2,
//         [classes.cellHighPriority]: groupId === 3
//       })}
//       groupingInfo={groupingInfo}
//       {...restProps}
//     />
//   );
// });
// const WeekViewDayScaleCell = withStyles(groupingStyles, {
//   name: "WeekViewDayScaleCell"
// })(({ groupingInfo, classes, ...restProps }) => {
//   const groupId = groupingInfo[0].id;
//   return (
//     <WeekView.DayScaleCell
//       className={classNames({
//         [classes.headerCellLowPriority]: groupId === 1,
//         [classes.headerCellMediumPriority]: groupId === 2,
//         [classes.headerCellHighPriority]: groupId === 3
//       })}
//       groupingInfo={groupingInfo}
//       {...restProps}
//     />
//   );
// });
// const AllDayCell = withStyles(groupingStyles, { name: "AllDayCell" })(
//   ({ groupingInfo, classes, ...restProps }) => {
//     const groupId = groupingInfo[0].id;
//     return (
//       <AllDayPanel.Cell
//         className={classNames({
//           [classes.cellLowPriority]: groupId === 1,
//           [classes.cellMediumPriority]: groupId === 2,
//           [classes.cellHighPriority]: groupId === 3
//         })}
//         groupingInfo={groupingInfo}
//         {...restProps}
//       />
//     );
//   }
// );
// const GroupingPanelCell = withStyles(groupingStyles, {
//   name: "GroupingPanelCell"
// })(({ group, classes, ...restProps }) => {
//   const groupId = group.id;
//   const Icon = getIconById(groupId);
//   return (
//     <GroupingPanel.Cell
//       className={classNames({
//         [classes.headerCellLowPriority]: groupId === 1,
//         [classes.headerCellMediumPriority]: groupId === 2,
//         [classes.headerCellHighPriority]: groupId === 3
//       })}
//       group={group}
//       {...restProps}
//     >
//       <Icon className={classes.icon} />
//     </GroupingPanel.Cell>
//   );
// });

// const PrioritySelectorItem = ({ color, text: resourceTitle }) => {
//   const text = resourceTitle || "All Tasks";
//   const shortText = resourceTitle ? text.substring(0, 1) : "All";
//   const classes = usePrioritySelectorItemStyles({ color });

//   return (
//     <div className={classes.prioritySelectorItem}>
//       <span className={classes.bullet} />
//       <span className={classes.priorityText}>{text}</span>
//       <span className={classes.priorityShortText}>{shortText}</span>
//     </div>
//   );
// };

// const PrioritySelector = withStyles(styles, { name: "PrioritySelector" })(
//   ({ classes, priorityChange, priority }) => {
//     const currentPriority = priority > 0 ? priorities[priority - 1] : {};
//     return (
//       <FormControl className={classes.prioritySelector}>
//         <Select
//           disableUnderline
//           value={priority}
//           onChange={e => {
//             priorityChange(e.target.value);
//           }}
//           renderValue={() => (
//             <PrioritySelectorItem
//               text={currentPriority.text}
//               color={currentPriority.color}
//             />
//           )}
//         >
//           <MenuItem value={0}>
//             <PrioritySelectorItem />
//           </MenuItem>
//           {priorities.map(({ id, color, text }) => (
//             <MenuItem value={id} key={id.toString()}>
//               <PrioritySelectorItem color={color} text={text} />
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     );
//   }
// );

// const FlexibleSpace = withStyles(styles, { name: "FlexibleSpace" })(
//   ({ classes, priority, priorityChange, ...restProps }) => (
//     <Toolbar.FlexibleSpace {...restProps} className={classes.flexibleSpace}>
//       <PrioritySelector priority={priority} priorityChange={priorityChange} />
//     </Toolbar.FlexibleSpace>
//   )
// );
// const TooltipContent = ({
//   appointmentData,
//   formatDate,
//   appointmentResources
// }) => {
//   const resource = appointmentResources[0];
//   const classes = useTooltipContentStyles({ color: resource.color });
//   let icon = <LowPriority className={classes.icon} />;
//   if (appointmentData.priorityId === 2) {
//     icon = <Event className={classes.icon} />;
//   }
//   if (appointmentData.priorityId === 3) {
//     icon = <PriorityHigh className={classes.icon} />;
//   }
//   return (
//     <div className={classes.content}>
//       <Grid
//         container
//         alignItems="flex-start"
//         className={classes.titleContainer}
//       >
//         <Grid item xs={2} className={classNames(classes.textCenter)}>
//           <Lens className={classNames(classes.lens, classes.colorfulContent)} />
//         </Grid>
//         <Grid item xs={10}>
//           <div>
//             <div className={classNames(classes.title, classes.dateAndTitle)}>
//               {appointmentData.title}
//             </div>
//             <div className={classNames(classes.text, classes.dateAndTitle)}>
//               {formatDate(appointmentData.startDate, {
//                 day: "numeric",
//                 weekday: "long"
//               })}
//             </div>
//           </div>
//         </Grid>
//       </Grid>
//       <Grid container alignItems="center" className={classes.contentContainer}>
//         <Grid item xs={2} className={classes.textCenter}>
//           <AccessTime className={classes.icon} />
//         </Grid>
//         <Grid item xs={10}>
//           <div className={classes.text}>
//             {`${formatDate(appointmentData.startDate, {
//               hour: "numeric",
//               minute: "numeric"
//             })}
//               - ${formatDate(appointmentData.endDate, {
//                 hour: "numeric",
//                 minute: "numeric"
//               })}`}
//           </div>
//         </Grid>
//       </Grid>
//       <Grid
//         container
//         alignItems="center"
//         key={`${resource.fieldName}_${resource.id}`}
//       >
//         <Grid
//           className={classNames(
//             classes.contentItemIcon,
//             classes.icon,
//             classes.colorfulContent
//           )}
//           item
//           xs={2}
//         >
//           {icon}
//         </Grid>
//         <Grid item xs={10}>
//           <span className={classNames(classes.text, classes.colorfulContent)}>
//             {resource.text}
//           </span>
//         </Grid>
//       </Grid>
//     </div>
//   );
// };

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       currentDate: "2018-05-28",
//       currentViewName: "Day",
//       data: tasks,
//       currentPriority: 0,
//       resources: [
//         {
//           fieldName: "priorityId",
//           title: "Priority",
//           instances: priorities
//         }
//       ]
//     };
//     this.currentViewNameChange = currentViewName => {
//       this.setState({ currentViewName });
//     };
//     this.currentDateChange = currentDate => {
//       this.setState({ currentDate });
//     };
//     this.priorityChange = value => {
//       const { resources } = this.state;
//       const nextResources = [
//         {
//           ...resources[0],
//           instances: value > 0 ? [priorities[value - 1]] : priorities
//         }
//       ];

//       this.setState({ currentPriority: value, resources: nextResources });
//     };
//     this.flexibleSpace = connectProps(FlexibleSpace, () => {
//       const { currentPriority } = this.state;
//       return {
//         priority: currentPriority,
//         priorityChange: this.priorityChange
//       };
//     });
//   }

//   componentDidUpdate() {
//     this.flexibleSpace.update();
//   }

//   render() {
//     const {
//       data,
//       currentDate,
//       currentViewName,
//       currentPriority,
//       resources
//     } = this.state;

//     return (
//       <Paper>
//         <Scheduler data={filterTasks(data, currentPriority)} height={660}>
//           <ViewState
//             currentDate={currentDate}
//             currentViewName={currentViewName}
//             onCurrentViewNameChange={this.currentViewNameChange}
//             onCurrentDateChange={this.currentDateChange}
//           />
//           <GroupingState grouping={grouping} />

//           <DayView
//             startDayHour={9}
//             endDayHour={19}
//             timeTableCellComponent={DayViewTimeTableCell}
//             dayScaleCellComponent={DayViewDayScaleCell}
//             intervalCount={7}
//           />
//           <WeekView
//             startDayHour={9}
//             endDayHour={17}
//             excludedDays={[0, 6]}
//             name=""
//             timeTableCellComponent={WeekViewTimeTableCell}
//             dayScaleCellComponent={WeekViewDayScaleCell}
//           />
//           {/* <AllDayPanel
//             cellComponent={AllDayCell}
//           /> */}

//           <Appointments />
//           <Resources data={resources} />
//           <IntegratedGrouping />

//           <GroupingPanel cellComponent={GroupingPanelCell} />
//           <Toolbar flexibleSpaceComponent={this.flexibleSpace} />
//           <DateNavigator />
//           <ViewSwitcher />
//           <AppointmentTooltip
//             contentComponent={TooltipContent}
//             showOpenButton
//             showCloseButton
//           />
//           <AppointmentForm readOnly />
//         </Scheduler>
//       </Paper>
//     );
//   }
// }

/* eslint-disable react/destructuring-assignment */
// import * as React from "react";
// import Paper from "@material-ui/core/Paper";
// import { ViewState, EditingState } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   WeekView,
//   Appointments,
//   DragDropProvider,
//   EditRecurrenceMenu,
//   ViewSwitcher,
//   AllDayPanel,
//   DayView,
//   DateNavigator
// } from "@devexpress/dx-react-scheduler-material-ui";

// const recurrenceAppointments = [
//   {
//     title: "Website Re-Design Plan",
//     startDate: new Date(2021, 2, 3, 10, 30),
//     endDate: new Date(2021, 2, 3, 11, 30),
//     id: 100,
//     rRule: "FREQ=DAILY;COUNT=3",
//     exDate: "20180628T063500Z,20180626T061500Z"
//   }
// ];

// const dragDisableIds = new Set([3, 8, 10, 12]);

// const allowDrag = ({ id }) => !dragDisableIds.has(id);
// const appointmentComponent = props => {
//   if (allowDrag(props.data)) {
//     return <Appointments.Appointment {...props} />;
//   }
//   return (
//     <Appointments.Appointment
//       {...props}
//       style={{ ...props.style, cursor: "not-allowed" }}
//     />
//   );
// };

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: recurrenceAppointments,
//       currentDate: new Date()
//     };

//     this.onCommitChanges = this.commitChanges.bind(this);
//   }

//   commitChanges({ added, changed, deleted }) {
//     this.setState(state => {
//       let { data } = state;
//       if (added) {
//         const startingAddedId =
//           data.length > 0 ? data[data.length - 1].id + 1 : 0;
//         data = [...data, { id: startingAddedId, ...added }];
//       }
//       if (changed) {
//         data = data.map(appointment =>
//           changed[appointment.id]
//             ? { ...appointment, ...changed[appointment.id] }
//             : appointment
//         );
//       }
//       if (deleted !== undefined) {
//         data = data.filter(appointment => appointment.id !== deleted);
//       }
//       return { data };
//     });
//   }

//   render() {
//     const { data, currentDate } = this.state;

//     return (
//       <Paper>
//         <Scheduler data={data} height={660}>
//           <ViewState
//             currentDate={currentDate}
//             // currentViewName={currentViewName}
//             onCurrentViewNameChange={this.currentViewNameChange}
//             onCurrentDateChange={this.currentDateChange}
//           />
//           <DayView
//             startDayHour={9}
//             endDayHour={19}
//             // timeTableCellComponent={DayViewTimeTableCell}
//             // dayScaleCellComponent={DayViewDayScaleCell}
//             intervalCount={7}
//           />
//           <EditingState onCommitChanges={this.onCommitChanges} />
//           <EditRecurrenceMenu />
//           <WeekView startDayHour={9} endDayHour={16} />
//           <DateNavigator />
//           <Appointments appointmentComponent={appointmentComponent} />
//           {/* <AllDayPanel /> */}
//           <DragDropProvider allowDrag={allowDrag} />
//         </Scheduler>
//       </Paper>
//     );
//   }
// }

// import * as React from "react";
// import Paper from "@material-ui/core/Paper";
// import {
//   ViewState,
//   EditingState,
//   IntegratedEditing
// } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   DayView,
//   Appointments,
//   AppointmentForm,
//   AppointmentTooltip,
//   ConfirmationDialog,
//   Toolbar,
//   DateNavigator,
//   TodayButton,
//   WeekView,
//   DragDropProvider
// } from "@devexpress/dx-react-scheduler-material-ui";

// import { appointments } from "../demo-data/appointaments";

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       data: appointments,
//       currentDate: new Date()
//     };

//     this.commitChanges = this.commitChanges.bind(this);
//   }

//   commitChanges({ added, changed, deleted }) {
//     this.setState(state => {
//       let { data } = state;
//       if (added) {
//         const startingAddedId =
//           data.length > 0 ? data[data.length - 1].id + 1 : 0;
//         data = [...data, { id: startingAddedId, ...added }];
//       }
//       if (changed) {
//         data = data.map(appointment =>
//           changed[appointment.id]
//             ? { ...appointment, ...changed[appointment.id] }
//             : appointment
//         );
//       }
//       if (deleted !== undefined) {
//         data = data.filter(appointment => appointment.id !== deleted);
//       }
//       return { data };
//     });
//   }

//   render() {
//     const { currentDate, data } = this.state;
//     const dragDisableIds = new Set([3, 8, 10, 12]);

//     const allowDrag = ({ id }) => !dragDisableIds.has(id);

//     return (
//       <Paper>
//         <Scheduler data={data} height={660}>
//           <ViewState currentDate={currentDate} />
//           <EditingState onCommitChanges={this.commitChanges} />
//           <IntegratedEditing />
//           <WeekView startDayHour={9} endDayHour={19} />
//           {/* <DayView startDayHour={9} endDayHour={19} /> */}
//           <Toolbar />
//           <DateNavigator />
//           <TodayButton />
//           <ConfirmationDialog />
//           <Appointments />
//           <AppointmentTooltip showOpenButton showDeleteButton />
//           <AppointmentForm />
//           <DragDropProvider allowDrag={allowDrag} />
//         </Scheduler>
//       </Paper>
//     );
//   }
// }

// import * as React from "react";
// import Paper from "@material-ui/core/Paper";
// import {
//   ViewState,
//   EditingState,
//   IntegratedEditing
// } from "@devexpress/dx-react-scheduler";
// import {
//   Scheduler,
//   DayView,
//   Appointments,
//   AppointmentForm,
//   AppointmentTooltip,
//   ConfirmationDialog,
//   Toolbar,
//   DateNavigator,
//   TodayButton,
//   WeekView,
//   Resources,
//   DragDropProvider
// } from "@devexpress/dx-react-scheduler-material-ui";

// import { appointments } from "../demo-data/appointaments";
// import { data, moviesData, theatreData } from "../demo-data/data";

// export default class Demo extends React.PureComponent {
//   constructor(props) {
//     super(props);

//     this.state = {
//       data: appointments,
//       currentDate: new Date()
//     };

//     this.commitChanges = this.commitChanges.bind(this);
//   }

//   commitChanges({ added, changed, deleted }) {
//     this.setState(state => {
//       let { data } = state;
//       if (added) {
//         const startingAddedId =
//           data.length > 0 ? data[data.length - 1].id + 1 : 0;
//         data = [...data, { id: startingAddedId, ...added }];
//       }
//       if (changed) {
//         data = data.map(appointment =>
//           changed[appointment.id]
//             ? { ...appointment, ...changed[appointment.id] }
//             : appointment
//         );
//       }
//       if (deleted !== undefined) {
//         data = data.filter(appointment => appointment.id !== deleted);
//       }
//       return { data };
//     });
//   }

//   resources = [
//     {
//       fieldName: "dentista",
//       title: "Dentistas",
//       instances: [
//         {
//           text: "Room 401",
//           id: 1,
//           color: "red"
//         },
//         {
//           text: "Room 402",
//           id: 2,
//           color: "blue"
//         },
//         {
//           text: "Room 403",
//           id: 3,
//           color: "pink"
//         },
//         {
//           text: "Room 407",
//           id: 4,
//           color: "green"
//         },
//         {
//           text: "Room 409",
//           id: 5,
//           color: "grey"
//         }
//       ]
//     }
//   ];

//   render() {
//     const { data, currentDate } = this.state;

//     const dragDisableIds = new Set([3, 8, 10, 12]);

//     const allowDrag = ({ id }) => !dragDisableIds.has(id);

//     return (
//       <Paper>
//         <Scheduler data={data} locale="pt-BR">
//           <ViewState defaultCurrentDate={currentDate} />
//           <EditingState onCommitChanges={this.commitChanges} />
//           <IntegratedEditing />
//           {/* <WeekView startDayHour={8} endDayHour={18} /> */}
//           <DayView startDayHour={8} endDayHour={18} intervalCount={7} />
//           <Toolbar />
//           <DateNavigator />
//           <TodayButton />
//           <ConfirmationDialog />
//           <Appointments />
//           <AppointmentTooltip showOpenButton showDeleteButton />
//           <AppointmentForm appointmentData={this.resources} />
//           <Resources
//             dataSource={moviesData}
//             fieldExpr="movieId"
//             useColorAsDefault={true}
//           />
//           <Resources dataSource={theatreData} fieldExpr="theatreId" />
//           <DragDropProvider allowDrag={allowDrag} />
//         </Scheduler>
//       </Paper>
//     );
//   }
// }

import React, { useState, useEffect } from "react";

import Scheduler, { Resource } from "devextreme-react/scheduler";
import notify from "devextreme/ui/notify";

import { data, holidays } from "./components2/data.js";
import Utils from "./components2/utils.js";
import DataCell from "./components2/DataCell";
import DateCell from "./components2/DateCell.js";
import TimeCell from "./components2/TimeCell.js";
import { loadMessages, locale } from "devextreme/localization";
import ptMessages from "devextreme/localization/messages/pt.json";
import { index, update, show, store } from "~/app/controllers/controller";
import { useSelector, connect } from "react-redux";
import { ThemeProvider } from "styled-components";

const currentDate = new Date();
const views = ["week", "workWeek", "day"];
const currentView = views[0];
loadMessages(ptMessages);
locale(navigator.language);

const App = () => {
  const [dentistas, setDentistas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    index("/dentists").then(({ data }) => {
      setDentistas(data);
    });

    index("/patients").then(({ data }) => {
      setPacientes(data);
    });

    index("/agendamentos").then(({ data }) => {
      setAgendamentos(data);
    });
  }, [reload]);

  function onAppointmentAddingFunc(e) {
    const isValidAppointment = Utils.isValidAppointment(
      e.component,
      e.appointmentData
    );
    if (!isValidAppointment) {
      e.cancel = true;
      notifyDisableDate();
    }
    console.log(e.appointmentData);

    store("agendamentos", isValidAppointment).then(data => {
      console.log(data);
      setReload(!reload);
    });
  }

  function onAppointmentUpdatingFunc(e) {
    const isValidAppointment = Utils.isValidAppointment(e.component, e.newData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  function notifyDisableDate() {
    notify("Problemas para criar o agendamento", "warning", 1000);
  }

  function notifyOK() {
    notify("Agendamento Criado", "success", 1000);
  }

  function applyDisableDatesToDateEditors(form) {
    const startDateEditor = form.getEditor("startDate");
    startDateEditor.option("disabledDates", holidays);

    const endDateEditor = form.getEditor("endDate");
    endDateEditor.option("disabledDates", holidays);
  }

  function renderDataCell(itemData) {
    return <DataCell itemData={itemData} />;
  }

  function renderDateCell(itemData) {
    return <DateCell itemData={itemData} />;
  }

  function renderTimeCell(itemData) {
    return <TimeCell itemData={itemData} />;
  }

  function toopltipComponent({ data }) {
    return (
      <div>
        <p>
          <strong>Dentista:</strong>
          {data.appointmentData.dentista_id}
        </p>
        <p>
          <strong>Paciente:</strong>
          {data.appointmentData.paciente_id}
        </p>
      </div>
    );
  }

  function dayWeek() {
    var d = new Date();
    var day = d.getDay();

    return day;
  }

  return (
    <Scheduler
      // timeZone="America/Sao_Paulo"
      dataSource={agendamentos}
      views={views}
      defaultCurrentView={currentView}
      defaultCurrentDate={currentDate}
      height="100%"
      showAllDayPanel={false}
      firstDayOfWeek={dayWeek()}
      startDayHour={8}
      endDayHour={18}
      dataCellRender={renderDataCell}
      dateCellRender={renderDateCell}
      timeCellRender={renderTimeCell}
      appointmentTooltipComponent={toopltipComponent}
      onAppointmentFormOpening={onAppointmentFormOpeningFunc}
      onAppointmentAdding={onAppointmentAddingFunc}
      onAppointmentUpdating={onAppointmentUpdatingFunc}
    ></Scheduler>
  );

  function onAppointmentFormOpeningFunc(data) {
    let form = data.form;

    let date = new Date();

    form.option("items", [
      {
        label: {
          text: "Dentista"
        },
        editorType: "dxSelectBox",
        dataField: "dentista_id",
        editorOptions: {
          searchEnabled: true,
          width: "100%",
          display: "inline",
          items: dentistas,
          displayExpr: "name",
          valueExpr: "id",
          onValueChanged: function(args) {
            // movieInfo = getMovieById(args.value);
            // form.updateData("director", movieInfo.director);
            // form.updateData(
            //   "endDate",
            //   new Date(startDate.getTime() + 60 * 1000 * movieInfo.duration)
            // );
          }
        }
      },
      {
        label: {
          text: "Paciente"
        },
        editorType: "dxSelectBox",
        dataField: "paciente_id",
        editorOptions: {
          searchEnabled: true,
          width: "100%",
          items: pacientes,
          displayExpr: "name",
          valueExpr: "id",
          onValueChanged: function(args) {}
        }
      },
      {
        label: {
          text: "Início"
        },
        dataField: "startDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "datetime",
          // value: date,
          onValueChanged: function(args) {}
        }
      },
      {
        label: {
          text: "Término"
        },
        dataField: "endDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "datetime",
          // value: date,
          onValueChanged: function(args) {}
        }
      }
    ]);
  }
};
export default App;
