﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using ohheck.help.Models.Data;
using System;

namespace ohheck.help.Migrations
{
    [DbContext(typeof(HeckingContext))]
    partial class HeckingContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "2.0.0-preview1-24937");

            modelBuilder.Entity("ohheck.help.Models.Data.Card", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("apiid");

                    b.Property<int>("attribute");

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<int>("gameid");

                    b.Property<int?>("idolid");

                    b.Property<string>("idolized_imageurl");

                    b.Property<string>("imageurl");

                    b.Property<bool>("ispromo");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<int>("rarity");

                    b.HasKey("id");

                    b.HasIndex("idolid");

                    b.ToTable("Cards");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.CardResponse", b =>
                {
                    b.Property<int>("cardid");

                    b.Property<int>("responseid");

                    b.HasKey("cardid", "responseid");

                    b.HasIndex("responseid");

                    b.ToTable("CardResponses");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Group", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<string>("name");

                    b.HasKey("id");

                    b.ToTable("Groups");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Idol", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<int?>("groupid");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<string>("name");

                    b.Property<int?>("subunitid");

                    b.HasKey("id");

                    b.HasIndex("groupid");

                    b.HasIndex("subunitid");

                    b.ToTable("Idols");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Subunit", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("Groupid");

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<string>("name");

                    b.HasKey("id");

                    b.HasIndex("Groupid");

                    b.ToTable("Subunits");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Survey", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("comments");

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<string>("name");

                    b.Property<string>("slug");

                    b.HasKey("id");

                    b.ToTable("Surveys");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.SurveyCard", b =>
                {
                    b.Property<int>("cardid");

                    b.Property<int>("surveyid");

                    b.HasKey("cardid", "surveyid");

                    b.HasIndex("surveyid");

                    b.ToTable("SurveyCards");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.SurveyResponse", b =>
                {
                    b.Property<int>("id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("comments");

                    b.Property<DateTime>("created");

                    b.Property<string>("createdby");

                    b.Property<DateTime>("modified");

                    b.Property<string>("modifiedby");

                    b.Property<int?>("surveyid");

                    b.HasKey("id");

                    b.HasIndex("surveyid");

                    b.ToTable("Responses");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Card", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Idol", "idol")
                        .WithMany("cards")
                        .HasForeignKey("idolid");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.CardResponse", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Card", "card")
                        .WithMany("cardresponses")
                        .HasForeignKey("cardid")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ohheck.help.Models.Data.SurveyResponse", "response")
                        .WithMany("cardresponses")
                        .HasForeignKey("responseid")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Idol", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Group", "group")
                        .WithMany("idols")
                        .HasForeignKey("groupid");

                    b.HasOne("ohheck.help.Models.Data.Subunit", "subunit")
                        .WithMany("idols")
                        .HasForeignKey("subunitid");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.Subunit", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Group")
                        .WithMany("subunits")
                        .HasForeignKey("Groupid");
                });

            modelBuilder.Entity("ohheck.help.Models.Data.SurveyCard", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Card", "card")
                        .WithMany("surveycards")
                        .HasForeignKey("cardid")
                        .OnDelete(DeleteBehavior.Cascade);

                    b.HasOne("ohheck.help.Models.Data.Survey", "survey")
                        .WithMany("surveycards")
                        .HasForeignKey("surveyid")
                        .OnDelete(DeleteBehavior.Cascade);
                });

            modelBuilder.Entity("ohheck.help.Models.Data.SurveyResponse", b =>
                {
                    b.HasOne("ohheck.help.Models.Data.Survey", "survey")
                        .WithMany("responses")
                        .HasForeignKey("surveyid");
                });
        }
    }
}
