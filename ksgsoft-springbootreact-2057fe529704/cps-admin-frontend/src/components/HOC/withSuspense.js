// Suspense enhance
import React, {Suspense} from "react";

export default function withSuspense(WrappedComponent) {
  return (props) => (
    <Suspense fallback={<div className="animated fadeIn pt-1 text-center">Loading...</div>}>
      <WrappedComponent {...props}/>
    </Suspense>
  )
}
