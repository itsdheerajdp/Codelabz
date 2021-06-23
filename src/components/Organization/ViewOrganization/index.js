import React, { useEffect, useState } from "react";
import { Card, Row, Col, Empty, Skeleton } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  GithubFilled,
  LinkOutlined,
  LinkedinFilled,
  FlagOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useParams } from "react-router-dom";
import { clearOrgData, getOrgData } from "../../../store/actions";

const ViewOrganization = () => {
  const { handle } = useParams();
  const [people, setPeople] = useState([]);
  const firebase = useFirebase();
  const dispatch = useDispatch();
  const firestore = useFirestore();
  const [followed, setFollowed] = useState(false);
  const db = firebase.firestore();
  const profileData = useSelector(({ firebase: { profile } }) => profile);

  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection("cl_org_general").onSnapshot((snap) => {
      const data = snap.docs.map((doc) => doc.data());
      console.log(data[0].followers);
      setPeople(data[0].followers);
      // console.log(data[0].followers.includes(profileData.handle));
      if (data[0].followers && data[0].followers.includes(profileData.handle))
        setFollowed((prev) => !prev);
    });

    return () => unsubscribe();
  }, []);

  const addValue = (value) => {
    setFollowed((prev) => !prev);
    if (people && people.includes(value)) {
      console.log("already followed");
    } else if (people) {
      const arr = [...people];
      arr.push(value);
      db.collection("cl_org_general").doc(handle).update({
        followers: arr,
      });
    } else {
      db.collection("cl_org_general")
        .doc(handle)
        .update({
          followers: [value],
        });
    }
  };

  const removeValue = (val) => {
    setFollowed((prev) => !prev);
    var filtered = people.filter(function (value, index, arr) {
      return value !== val;
    });
    db.collection("cl_org_general").doc(handle).update({
      followers: filtered,
    });
  };

  const loading = useSelector(
    ({
      org: {
        data: { loading },
      },
    }) => loading
  );

  const currentOrgData = useSelector(
    ({
      org: {
        data: { data },
      },
    }) => data
  );

  const organizations = useSelector(
    ({
      firebase: {
        profile: { organizations },
      },
    }) => organizations
  );

  useEffect(() => {
    getOrgData(handle, organizations)(firebase, firestore, dispatch);
    setImageLoading(true);
    return () => {
      clearOrgData()(dispatch);
    };
  }, [handle, firebase, firestore, dispatch, organizations]);

  const checkAvailable = (data) => {
    return !!(data && data.length > 0);
  };

  return (
    <Card
      loading={loading}
      title={"Organization Details"}
      style={{ width: "100%" }}
      className="p-0"
    >
      {currentOrgData && (
        <Row>
          <Col xs={24} md={8} lg={8}>
            <Card
              style={{ width: "100%" }}
              bordered={false}
              cover={
                currentOrgData.org_image &&
                currentOrgData.org_image.length > 0 ? (
                  <>
                    {imageLoading && <Skeleton />}
                    <img
                      src={currentOrgData.org_image}
                      alt={currentOrgData.org_name}
                      className="org-image"
                      onLoad={() => {
                        setImageLoading(false);
                      }}
                      style={{ display: imageLoading ? "none" : "block" }}
                    />
                  </>
                ) : (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={"No image available"}
                  />
                )
              }
              className="org-image-card"
            />
          </Col>
          <Col xs={24} md={16} lg={16} className="pl-24-d pt-24-m">
            <p>
              <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>
                {currentOrgData.org_name}
              </span>
            </p>
            {checkAvailable(currentOrgData.org_description) && (
              <p className="text-justified">{currentOrgData.org_description}</p>
            )}
            {checkAvailable(currentOrgData.org_link_facebook) && (
              <p>
                <a
                  href={
                    "https://www.facebook.com/" +
                    currentOrgData.org_link_facebook
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookFilled className="facebook-color" />{" "}
                  {currentOrgData.org_link_facebook}
                </a>
              </p>
            )}
            {checkAvailable(currentOrgData.org_link_twitter) && (
              <p>
                <a
                  href={
                    "https://twitter.com/" + currentOrgData.org_link_twitter
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterSquareFilled className="twitter-color" />{" "}
                  {currentOrgData.org_link_twitter}
                </a>
              </p>
            )}
            {checkAvailable(currentOrgData.org_link_github) && (
              <p>
                <a
                  href={"https://github.com/" + currentOrgData.org_link_github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GithubFilled className="github-color" />{" "}
                  {currentOrgData.org_link_github}
                </a>
              </p>
            )}
            {checkAvailable(currentOrgData.org_link_linkedin) && (
              <p>
                <a
                  href={
                    "https://www.linkedin.com/company/" +
                    currentOrgData.org_link_linkedin
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkedinFilled className="linkedin-color" />{" "}
                  {currentOrgData.org_link_linkedin}
                </a>
              </p>
            )}
            {checkAvailable(currentOrgData.org_website) && (
              <p>
                <a
                  href={currentOrgData.org_website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkOutlined className="website-color" />{" "}
                  {currentOrgData.org_website}
                </a>
              </p>
            )}
            {checkAvailable(currentOrgData.org_country) && (
              <p className="mb-0">
                <a
                  href={
                    "https://www.google.com/search?q=" +
                    currentOrgData.org_country
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FlagOutlined className="website-color" />{" "}
                  {currentOrgData.org_country}
                </a>
              </p>
            )}
            {/* {console.log(people)} */}
            {/* {!followed ? (
              <button onClick={(e) => addValue(profileData.handle)}>
                follow
              </button>
            ) : (
              <button onClick={(e) => removeValue(profileData.handle)}>
                unfollow
              </button>
            )} */}
            {!people ? (
              <button onClick={(e) => addValue(profileData.handle)}>
                Follow
              </button>
            ) : !people.includes(profileData.handle) ? (
              <button onClick={(e) => addValue(profileData.handle)}>
                follow
              </button>
            ) : (
              <button onClick={(e) => removeValue(profileData.handle)}>
                unfollow
              </button>
            )}
            {/* { people && !people.includes(profileData.handle) ? (
              <button onClick={(e) => addValue(profileData.handle)}>
                follow
              </button>
            ) : (
              <button onClick={(e) => removeValue(profileData.handle)}>
                unfollow
              </button>
            )} */}
          </Col>
        </Row>
      )}
      {currentOrgData === false && "No organization with the provided handle"}
    </Card>
  );
};

export default ViewOrganization;
