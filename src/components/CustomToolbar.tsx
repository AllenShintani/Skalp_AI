import React from 'react'

const CustomToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <select
        className="ql-header"
        defaultValue="3"
      >
        <option value="1" />
        <option value="2" />
        <option value="3" />
      </select>
      <button
        className="ql-list"
        value="ordered"
      />
      <button
        className="ql-list"
        value="bullet"
      />
    </span>
    <span className="ql-formats">
      <button className="ql-link" />
      <button className="ql-image" />
    </span>
  </div>
)

export default CustomToolbar
