import React from 'react';
import { LoadingOutlined, CrownOutlined } from '@ant-design/icons';

import './styles.css';

const TeamsLeaderboard = ({ teams }) => {
  const FIRST_PLACE_IN_POINTS =
    teams.length > 0 &&
    Math.max.apply(
      Math,
      teams.map(({ total }) => total)
    );

  return (
    <div className="teams-container">
      {teams
        .sort((t1, t2) => t2.total - t1.total)
        .map(
          ({ team, connected, total }, i) =>
            team && (
              <div
                className={`team-section ${
                  total === FIRST_PLACE_IN_POINTS && total !== 0
                    ? 'first-place'
                    : ''
                }`}
                key={team._id}>
                <p>{team.name}</p>
                {connected ? (
                  <div className="team-info">
                    <span className="team-placement">
                      {total === FIRST_PLACE_IN_POINTS && total !== 0 ? (
                        <CrownOutlined
                          style={{
                            marginTop: '1.5%',
                            color: '#FFD700',
                          }}
                        />
                      ) : (
                        ''
                      )}
                    </span>
                    <span className="team-total">{total}</span>
                  </div>
                ) : (
                  <div style={{ fontSize: '16px', color: 'red' }}>
                    <span style={{ marginRight: '2%' }}>Esperando equipo</span>
                    <LoadingOutlined />
                  </div>
                )}
              </div>
            )
        )}
    </div>
  );
};

export default TeamsLeaderboard;
