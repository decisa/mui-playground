import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
} from 'react-router-dom'

import React from 'react'

type WrappedLink = Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }

const LinkBehavior = React.forwardRef<HTMLAnchorElement, WrappedLink>(
  (props, ref) => {
    const { href, ...other } = props
    // Map href (Material UI) -> to (react-router)
    return <RouterLink ref={ref} to={href} {...other} role={undefined} />
  }
)

LinkBehavior.displayName = 'Link'

export default LinkBehavior
