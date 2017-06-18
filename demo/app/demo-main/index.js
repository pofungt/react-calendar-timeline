import React, { Component } from 'react'
import moment from 'moment'

import Timeline from 'react-calendar-timeline'
// import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container'

import generateFakeData from '../generate-fake-data'

var minTime = moment().add(-6, 'months').valueOf()
var maxTime = moment().add(6, 'months').valueOf()

var keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end'
}

export default class App extends Component {
  constructor (props) {
    super(props)

    const { groups, items } = generateFakeData()
    const defaultTimeStart = moment().startOf('day').toDate()
    const defaultTimeEnd = moment().startOf('day').add(1, 'day').toDate()

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd
    }
  }

  handleCanvasClick = (groupId, time, event) => {
    console.log('Canvas clicked', groupId, time)
  }

  handleCanvasContextMenu = (group, time, e) => {
    console.log('Canvas context menu', group, time)
  }

  handleItemClick = (itemId) => {
    console.log('Clicked: ' + itemId)
  }

  handleItemSelect = (itemId) => {
    console.log('Selected: ' + itemId)
  }

  handleItemContextMenu = (itemId) => {
    console.log('Context Menu: ' + itemId)
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state

    const group = groups[newGroupOrder]

    this.setState({
      items: items.map(item => item.id === itemId ? Object.assign({}, item, {
        start: dragTime,
        end: dragTime + (item.end - item.start),
        group: group.id
      }) : item)
    })

    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state

    this.setState({
      items: items.map(item => item.id === itemId ? Object.assign({}, item, {
        start: edge === 'left' ? time : item.start,
        end: edge === 'left' ? item.end : time
      }) : item)
    })

    console.log('Resized', itemId, time, edge)
  }

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime)
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
    }
  }

  moveResizeValidator = (action, item, time, resizeEdge) => {
    if (time < new Date().getTime()) {
      var newTime = Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
      return newTime
    }

    return time
  }

  // itemRenderer = ({ item }) => {
  //   return (
  //     <div className='custom-item'>
  //       <span className='title'>{item.title}</span>
  //       <p className='tip'>{item.itemProps['data-tip']}</p>
  //     </div>
  //   )
  // }

  // groupRenderer = ({ group }) => {
  //   return (
  //     <div className='custom-group'>
  //       {group.title}
  //     </div>
  //   )
  // }

  render () {
    const { groups, items, defaultTimeStart, defaultTimeEnd } = this.state

    return (
      <Timeline groups={groups}
                items={items}
                keys={keys}
                fixedHeader='fixed'
                fullUpdate

                sidebarWidth={150}
                sidebarContent={<div>Above The Left</div>}
                rightSidebarWidth={150}
                rightSidebarContent={<div>Above The Right</div>}

                canMove
                canResize='right'
                canSelect

                itemsSorted
                itemTouchSendsClick={false}
                stackItems
                itemHeightRatio={0.75}

                showCursorLine

                // resizeDetector={containerResizeDetector}

                defaultTimeStart={defaultTimeStart}
                defaultTimeEnd={defaultTimeEnd}

                // itemRenderer={this.itemRenderer}
                // groupRenderer={this.groupRenderer}

                onCanvasClick={this.handleCanvasClick}
                onCanvasContextMenu={this.handleCanvasContextMenu}

                onItemClick={this.handleItemClick}
                onItemSelect={this.handleItemSelect}
                onItemContextMenu={this.handleItemContextMenu}
                onItemMove={this.handleItemMove}
                onItemResize={this.handleItemResize}

                onTimeChange={this.handleTimeChange}

                moveResizeValidator={this.moveResizeValidator} />
    )
  }
}