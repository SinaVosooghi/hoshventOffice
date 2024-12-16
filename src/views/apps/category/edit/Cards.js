import * as React from "react";
import PrintableCard from "../../workshops/PrintableCard";

const Cards = React.forwardRef((props, ref) => {
  const { users } = props;

  return (
    <div ref={ref} style={{ }}>
      <div
        style={{
          width: "7in",
          height: "9.25in",
          position: "relative",
        }}
      >
        {users?.map((user) => {
          const itemUser = { user: user };
          return (
            <>
              <PrintableCard key={user.id} itemUser={itemUser} event={""} />
            </>
          );
        })}
      </div>
    </div>
  );
});

export default Cards;
