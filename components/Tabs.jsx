'use client'

import { motion } from 'framer-motion'

const Tabs = ({ text, selected, setSelected }) => {
  return (
    <button
      onClick={() => setSelected(text)}
      className={`${
        selected ? 'text-white bg-blue-700' : 'text-orange-600 hover:text-red-700'
      } relative rounded-md px-4 py-2 text-sm font-medium transition-colors`}
    >
      <span className="relative z-10">{text}</span>
      {selected && (
        <motion.span
          layoutId="tab"
          transition={{ type: 'spring', duration: 0.4 }}
          className="absolute inset-0 z-0 rounded-md bg-blue-800"
        ></motion.span>
      )}
    </button>
  )
}

export default Tabs
